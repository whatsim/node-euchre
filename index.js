var game = (function(){
	var numPlayers = 4,
	dealIndex = 0,
	playIndex = 0,
	trumpSuit = "",
	trick = [],
	deck = [
		"HA",
		"HK",
		"HQ",
		"HJ",
		"HT",
		"HN",
		"DA",
		"DK",
		"DQ",
		"DJ",
		"DT",
		"DN",
		"CA",
		"CK",
		"CQ",
		"CJ",
		"CT",
		"CN",
		"SA",
		"SK",
		"SQ",
		"SJ",
		"ST",
		"SN"
	],
	otherSuit = {
		'H' : 'D',
		'D' : 'H',
		'C' : 'S',
		'S' : 'C'	
	},
	playDeck = [],
	hands = [],
	order = [
		'start',
		'shuffle',
		'deal',
		'bid',
		'order',
		'dealerDiscard',
		'hand',
	],
	stage = 0,
	score = [0,0],
	trickScore = [0,0],
	callingTeam = 0
	actions = {
		start : function(){
			score = [0,0]
			stage = 1
			dealIndex = Math.floor(numPlayers * Math.random())
		},
		shuffle : function(){
			playDeck = deck.slice()
			for (var i = playDeck.length-1; i --; i >= 0) {
				var temp = playDeck[i]
				var rand = Math.floor(Math.random()*playDeck.length)
				playDeck[i] = playDeck[rand]
				playDeck[rand] = temp
			}
			playIndex = dealIndex
			stage = 2
		},
		deal : function(){
			hands = [[],[],[],[]]
			var i = dealIndex
			for(var count = 0; count < numPlayers * 2; count++){
				i = (i + 1) % numPlayers
				var twoOrThree = count < 4 ? count % 2 == 0 : (count - 1) % 2 == 0
				hands[i] = hands[i].concat(twoOrThree ? [playDeck.pop(),playDeck.pop()] : [playDeck.pop(),playDeck.pop(),playDeck.pop()])
				if(count >= 4) hands[i].sort()
			} 
			playIndex = (dealIndex + 1) % numPlayers
			stage = 3
		},
		bid : function(pickUp){
			if(pickUp){
				actions.order(playDeck[0][0])
				hands[dealIndex].push(playDeck.shift())
				stage = 5
			} else {
				if(playIndex == dealIndex) stage = 4
				playIndex = (playIndex + 1) % numPlayers
			}
		},
		dealerDiscard : function(indexToDiscard){
			playDeck.unshift(hands[dealIndex].splice(indexToDiscard,1)[0])
			stage = 6
		},
		order : function(suit){
			if(suit){
				trumpSuit = suit
				stage = 6
				callingTeam = playIndex % 2
				playIndex = (dealIndex + 1) % numPlayers
			} else {
				if(playIndex == dealIndex){
					stage = 1
					dealIndex = (dealIndex + 1) % numPlayers
				}
				playIndex = (playIndex + 1) % numPlayers
			}
		},
		hand : function(play){
			trick.push(hands[play.playerIndex].splice(play.cardIndex,1)[0])
			
			if(trick.length == 4){
				var ranking = actions.generateRanking()
				var winningIndex = 0;
				var topCard = trick[0]
				for(var i = 1; i < 4; i ++){
					topCard = actions.testCards(ranking,topCard,trick[i])
					winningIndex = topCard == trick[i] ? i : winningIndex
				}
				playIndex = (playIndex + winningIndex) % 4
				trickScore[playIndex % 2] ++
				trick = []
				if(trickScore[0]+trickScore[1] == 5){
					var wonTrick = trickScore[0] > trickScore[1] ? 0 : 1
					if(callingTeam == wonTrick){
						score[wonTrick] ++
						if(trickScore[callingTeam] == 5) score[wonTrick] ++
					} else {
						score[wonTrick] += 2
					}
					
					trickScore = [0,0]
					
					if(score[wonTrick] >= 10) {
						//YOU WIN!!!!!11!!
						console.log('winnar')
						stage = 0
					} else {
						stage = 1
						dealIndex = (dealIndex + 1) % numPlayers
					}
				}
			} else playIndex = (playIndex + 1) % numPlayers
		},
		generateRanking : function (){
			var ranking = {}
			var leadSuit = trick[0][0]

			ranking[leadSuit+"A"] = 7
			ranking[leadSuit+"K"] = 8
			ranking[leadSuit+"Q"] = 9
			ranking[leadSuit+"J"] = 10
			ranking[leadSuit+"T"] = 11
			ranking[leadSuit+"N"] = 12

			ranking[trumpSuit+"J"] = 0
			ranking[otherSuit[trumpSuit]+"J"] = 1
			ranking[trumpSuit+"A"] = 2
			ranking[trumpSuit+"K"] = 3
			ranking[trumpSuit+"Q"] = 4
			ranking[trumpSuit+"T"] = 5
			ranking[trumpSuit+"N"] = 6
			
			return ranking
		},
		testCards : function(ranking, cardOne, cardTwo){
			var cardOneRanking = ranking[cardOne] != undefined ? ranking[cardOne] : 100
			var cardTwoRanking = ranking[cardTwo] != undefined ? ranking[cardTwo] : 100
			return cardOneRanking <= cardTwoRanking ? cardOne : cardTwo
		},
		getDeck : function(){
			return playDeck
		},
		getHands : function(){
			return hands
		},
		getIndexes : function(){
			return {
				playIndex : playIndex,
				dealIndex : dealIndex
			}
		},
		getScore : function(){
			return score
		},
		step : function(change){
			actions[order[stage]](change)
			return(stage)
		}

	}
	return actions
})()

game.start()

while(!(game.getScore()[0] >= 10 || game.getScore()[1] >= 10)) {
	game.step() //shuffle
	game.step()	//deal
	game.step(true)	//call
	// alternately you step through the calling process and 
	// game.step(SuitString)
	// on the next time around
	game.step(0)	//dealer discard card index
	//a trick worth of single plays
	for(var i = 0; i < 20; i++) game.step({playerIndex:game.getIndexes().playIndex,cardIndex:0})
}
console.log("final",game.getScore())