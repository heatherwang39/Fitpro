#!/bin/bash
cd app &&
npm install &&
npm run lint &&
npm run build &&
npm run test &&
cd ../server &&
npm install &&
npm run lint &&
npm run build &&
npm run test
