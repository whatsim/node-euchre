A js euchre server for playing over websocket with friends and enemies.

Going to start with server only.

This is largely where it needs to be on the euchre representation side, with exceptions of a couple of behaviors this has a complete sense of the rules of euchre, and controls flow of play.

Still missing:

1. No 'going alone'
2. Common house rules, 'farmer's hand' or 'stick the dealer'
3. the server and websocket parts

Not going to add:

1. Follow Suit Enforcement. There should be a player way to call shenanigans and force the penalty, but the system will let you play the wrong card.
2. Euchre bot, at least not inline, though I want to look into doing that in a way that interops with this past potentially further on.
