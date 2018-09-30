#!/bin/bash
# based on this article
# https://www.digitalocean.com/community/tutorials/how-to-add-swap-space-on-ubuntu-18-04

if [[ -f /swapfile ]]; then
  echo 'swap exists'
  exit 0
fi
if [[ $UID != 0 ]]; then
  echo 'must run as root' >&2
  exit 1
fi

# create swap file
fallocate -l 4G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile

# add swap mount to fstab
echo '/swapfile none swap sw 0 0' >> /etc/fstab

# tweak swap space usage
sysctl vm.swappiness=10
echo 'vm.swappiness=10' >> /etc/sysctl.conf
sysctl vm.vfs_cache_pressure=50
echo 'vm.vfs_cache_pressure=50' >> /etc/sysctl.conf

# print success message
echo 'swap partition created success!'
free -h
