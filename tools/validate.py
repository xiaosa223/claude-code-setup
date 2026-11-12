#!/usr/bin/env python3
"""Offline checks. Does not connect to a server, create credentials or run deployment phases."""
import ast
import json
import os
from pathlib import Path
import re
import subprocess

ROOT = Path(__file__).resolve().parent.parent
SKILL = ROOT / 'skills/claude-code-setup'

def main():
    files = [p for p in ROOT.rglob('*') if p.is_file() and not {'.git', '__pycache__', 'node_modules'}.intersection(p.parts)]
    python_files, shell_files = [], []
    for path in files:
        assert path.suffix not in {'.pem', '.ppk', '.dpapi', '.p8', '.sqlite'}, f'Private artifact: {path}'
        assert path.name not in {'delivery.json', '.env'}, f'Local configuration: {path}'
        text = path.read_text(encoding='utf-8-sig')
        assert not re.search(r'gh[pousr]_[A-Za-z0-9]{25,}', text), f'Credential marker: {path}'
        assert not re.search(r'sk-ant-oat01-[A-Za-z0-9_-]{30,}', text), f'Credential marker: {path}'
        first = text.splitlines()[0] if text else ''
        if path.suffix == '.py' or first.startswith('#!') and 'python' in first:
            ast.parse(text, filename=str(path)); python_files.append(str(path.relative_to(ROOT)))
        if path.suffix == '.sh' or first.startswith('#!') and 'bash' in first:
            shell_files.append(path)
        if path.suffix == '.json':
            json.loads(text)
    entry = (SKILL / 'SKILL.md').read_text(encoding='utf-8')
    assert entry.startswith('---\nname: claude-code-setup\n')
    assert len(entry.splitlines()) < 500
    for path in [SKILL / 'SKILL.md', *list((SKILL / 'references').glob('*.md'))]:
        text = path.read_text(encoding='utf-8')
        for target in re.findall(r'\]\(([^)]+)\)', text):
            if not target.startswith(('https://', 'http://', '#')):
                assert (path.parent / target.split('#', 1)[0]).is_file(), f'Broken reference in {path}: {target}'
    assert 'claude setup-token' in entry
    assert 'https://vps.xiaoxiaodong.ai' not in entry
    assert (SKILL / 'LICENSE').is_file()
    assert (SKILL / 'windows/scripts/Core.ps1').is_file()
    assert (SKILL / 'scripts/server/files/clash-template.yaml').is_file()
    if os.name != 'nt':
        for path in shell_files:
            subprocess.run(['bash', '-n', str(path)], check=True)
    print(json.dumps({'status': 'passed', 'public_files': len(files), 'python_syntax_checks': len(python_files), 'shell_syntax_checks': len(shell_files) if os.name != 'nt' else 'Use Linux CI or the separate WSL check', 'live_deployments': 0, 'real_account_requests': 0}, ensure_ascii=False, indent=2))

if __name__ == '__main__':
    main()
