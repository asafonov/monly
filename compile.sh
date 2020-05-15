> script.js
for i in `ls models`; do cat models/$i | grep -v ^\n*$ >> script.js; done
for i in `ls view`; do cat view/$i | grep -v ^\n*$ >> script.js; done
