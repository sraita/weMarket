#!/bin/bash

rm -rf weMarketAdmin.tar.gz
meteor build --allow-superuser --architecture=os.linux.x86_64 --server=http://market.raidcdn.cn ../
mv ../weMarketAdmin.tar.gz ./

echo "run \"docker build -t sraita/wemarket:version .\""
