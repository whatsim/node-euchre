A js euchre server for playing over websocket with friends and enemies.

Going to start with server only.

This is largely where it needs to be on the euchre representation side, with exceptions of a couple of behaviors this has a complete sense of the rules of euchre, and controls flow of play.

Worth noting the demo hands that get played in the script right now don't follow the rules, or even play sensibly, everyone just calls immediately and plays the first card in their hand when its their turn. Its just to test flow, hand resolution, and scoring.

Still missing:

1. 'Going alone'.
2. Common house rules, 'farmer's hand' or 'stick the dealer'.
3. We already won the trick speed up button that short cuts to scoring.
4. The server and websocket parts.
5. Enforcement of turn order.

Not going to add:

1. Follow Suit Enforcement. There should be a player way to call shenanigans and force the penalty, but the system will let you play the wrong card.
2. Euchre bot, at least not inline. I want to look into doing that in a way that interops with this potentially further on.