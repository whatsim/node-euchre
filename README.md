A js euchre server for playing over websocket with friends and enemies.

Going to start with server only.

a generic card game system.

1) takes a deck set, a num players, a deal order and final deal size, along with post deal behavior, like 'draw and reveal a card', or 'give a player card off the deck' or 'shuffle discard'
2) allows for cards from the deck to be revealed centrally or dealt to hands, in an order dictated by a configuration. For instance, euchre's 2-3-2-3-3-2-3-2 deal pattern.
3) can be configured for multiple types of deal scenarios.

a generic game system.

1) turn order, deal order, other actions, when to redeal
2) scoring
3) winning

i think it'll be out of scope to save if something is a 'valid' play, just cause cheating is a part of actually playing cards. I'm tempted to just write the dealing and euchre parts, and not enforce any gameplay rules at all.
