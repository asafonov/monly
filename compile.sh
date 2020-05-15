> script.js
for i in `ls models`; do cat models/$i | grep -v ^[\n\s\t]*$ >> script.js; done
for i in `ls view`; do cat view/$i | grep -v ^[\n\s\t]*$ >> script.js; done
cat globals.js | grep -v ^[\n\s\t]*$ >> script.js
cat init.js | grep -v ^[\n\s\t]*$ >> script.js
