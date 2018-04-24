#!/usr/bin/env python3

import json
import subprocess
import time

import requests


def get_comp(funcname="func"):
    data = {}
    data['files'] = [{"type": "full", "name": "file", "text": "R." + funcname}]
    data['query'] = {"type": "type", "file": "#0", "end": 2}
    resp = requests.post('http://0.0.0.0:33000', json=data)
    return resp.json()


def check_funcs():
    with open('ramda.json') as fp:
        funcs = json.load(fp)['R']
        time.sleep(1.5)
        for func in sorted(funcs.keys()):
            try:
                data = get_comp(func)
            except:
                break
            data['type'] = data['type'].strip()
            sig = funcs[func]['!type'].strip()
            if sig and sig != data['type']:
                print('{name:<15}\n{sig}\n{type}\n'.format(**data, sig=sig))


def main():
    tern = subprocess.Popen(['tern', '--port', '33000'])
    try:
        check_funcs()
    finally:
        tern.terminate()


if __name__ == "__main__":
    main()
