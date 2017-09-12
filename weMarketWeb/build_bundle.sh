#!/bin/bash

rm -rf weMarketWeb.tar.gz
meteor build --allow-superuser --architecture=os.linux.x86_64 --server=http://market.raidcdn.cn  ../
mv ../weMarketWeb.tar.gz ./

echo "run \"docker build -t sraita/quxue:version .\""
