## Notes
- subresource integrity added to safely load 3rd party dependencies
- Standard ESLint check passed: https://eslint.org/demo 
- Standard PEP8 passed. Max 79 chars rule ignored.
- It was assumed that the initial part was not meant to be changed. Only the calculation part and report features should added to it.
- Instead of reading the team everytime the score is calculated we could just save it as part of the initialization process.
- Everything was kept as dynamic as possible. We can adjust the teams (add/delete/change the name) and everything should still work.
- Given the simplicity, no fancy implementation as taken (make it more OOish using classes)
- Further optimization would be possible by merging the objects to reduce the number of manual lookups or using references.

The python example can handle the output of the javascript file. You can invoke the JS version and pipe the output to the python script like this: `node newgame.js | python3 newgame.py`
