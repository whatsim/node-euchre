var game = (function(){
	var games = {}
	var numPlayers = 4,
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
	order = [
		'start',
		'shuffle',
		'deal',
		'bid',
		'order',
		'dealerDiscard',
		'hand',
	],
	actions = {
		start : function(gameID){
			games[gameID] = {
				dealIndex : Math.floor(numPlayers * Math.random()),
				playIndex : 0,
				trumpSuit : "",
				trick : [],
				playDeck : [],
				hands : [],
				stage : 1,
				score : [0,0],
				trickScore : [0,0],
				callingTeam : 0
			}
		},
		shuffle : function(gameID){
			var playDeck = deck.slice()
			for (var i = playDeck.length-1; i --; i >= 0) {
				var temp = playDeck[i]
				var rand = Math.floor(Math.random()*playDeck.length)
				playDeck[i] = playDeck[rand]
				playDeck[rand] = temp
			}
			games[gameID].playIndex = games[gameID].dealIndex
			games[gameID].stage = 2
			games[gameID].playDeck = playDeck
		},
		deal : function(gameID){
			var hands = [[],[],[],[]]
			var i = games[gameID].dealIndex
			for(var count = 0; count < numPlayers * 2; count++){
				i = (i + 1) % numPlayers
				var twoOrThree = count < 4 ? count % 2 == 0 : (count - 1) % 2 == 0
				hands[i] = hands[i].concat(twoOrThree ? [games[gameID].playDeck.pop(),games[gameID].playDeck.pop()] : [games[gameID].playDeck.pop(),games[gameID].playDeck.pop(),games[gameID].playDeck.pop()])
				if(count >= 4) hands[i].sort()
			} 
			games[gameID].playIndex = (games[gameID].dealIndex + 1) % numPlayers
			games[gameID].stage = 3
			games[gameID].hands = hands
		},
		bid : function(gameID,pickUp){
			if(pickUp){
				actions.order(gameID,games[gameID].playDeck[0][0])
				games[gameID].hands[games[gameID].dealIndex].push(games[gameID].playDeck.shift())
				games[gameID].stage = 5
			} else {
				if(games[gameID].playIndex == games[gameID].dealIndex) games[gameID].stage = 4
				games[gameID].playIndex = (games[gameID].playIndex + 1) % numPlayers
			}
		},
		dealerDiscard : function(gameID,indexToDiscard){
			games[gameID].playDeck.unshift(games[gameID].hands[games[gameID].dealIndex].splice(indexToDiscard,1)[0])
			games[gameID].stage = 6
		},
		order : function(gameID,suit){
			if(suit){
				games[gameID].trumpSuit = suit
				games[gameID].stage = 6
				games[gameID].callingTeam = games[gameID].playIndex % 2
				games[gameID].playIndex = (games[gameID].dealIndex + 1) % numPlayers
			} else {
				if(games[gameID].playIndex == games[gameID].dealIndex){
					games[gameID].stage = 1
					games[gameID].dealIndex = (games[gameID].dealIndex + 1) % numPlayers
				}
				games[gameID].playIndex = (games[gameID].playIndex + 1) % numPlayers
			}
		},
		hand : function(gameID, play){
			games[gameID].trick.push(games[gameID].hands[play.playerIndex].splice(play.cardIndex,1)[0])
			
			if(games[gameID].trick.length == 4){
				var ranking = actions.generateRanking(gameID)
				var winningIndex = 0;
				var topCard = games[gameID].trick[0]
				for(var i = 1; i < 4; i ++){
					topCard = actions.testCards(ranking,topCard,games[gameID].trick[i])
					winningIndex = topCard == games[gameID].trick[i] ? i : winningIndex
				}
				games[gameID].playIndex = (games[gameID].playIndex + winningIndex) % 4
				games[gameID].trickScore[games[gameID].playIndex % 2] ++
				games[gameID].trick = []
				if(games[gameID].trickScore[0]+games[gameID].trickScore[1] == 5){
					var wonTrick = games[gameID].trickScore[0] > games[gameID].trickScore[1] ? 0 : 1
					if(games[gameID].callingTeam == wonTrick){
						games[gameID].score[wonTrick] ++
						if(games[gameID].trickScore[games[gameID].callingTeam] == 5) games[gameID].score[wonTrick] ++
					} else {
						games[gameID].score[wonTrick] += 2
					}
					
					games[gameID].trickScore = [0,0]
					
					if(games[gameID].score[wonTrick] >= 10) {
						//YOU WIN!!!!!11!!
						console.log('winnar')
						games[gameID].stage = 0
					} else {
						games[gameID].stage = 1
						games[gameID].dealIndex = (games[gameID].dealIndex + 1) % numPlayers
					}
				}
			} else games[gameID].playIndex = (games[gameID].playIndex + 1) % numPlayers
		},
		generateRanking : function (gameID){
			var ranking = {}
			var leadSuit = games[gameID].trick[0][0]
			var trumpSuit = games[gameID].trumpSuit

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
		getDeck : function(gameID){
			return games[gameID].playDeck
		},
		getHands : function(gameID){
			return games[gameID].hands
		},
		getIndexes : function(gameID){
			return {
				playIndex : games[gameID].playIndex,
				dealIndex : games[gameID].dealIndex
			}
		},
		getScore : function(gameID){
			return games[gameID].score
		},
		step : function(gameID,change){
			actions[order[games[gameID].stage]](gameID,change)
			return(games[gameID].stage)
		}

	}
	return actions
})()

game.start(0) //first arguement of start and step is always the game ID

while(!(game.getScore(0)[0] >= 10 || game.getScore(0)[1] >= 10)) {
	game.step(0) //shuffle
	game.step(0)	//deal
	game.step(0,true)	//call
	// alternately you step through the calling process and 
	// game.step(0,SuitString)
	// on the next time around
	game.step(0,0)	//dealer discard card index
	//a trick worth of single plays
	for(var i = 0; i < 20; i++) {
		game.step(0,{playerIndex:game.getIndexes(0).playIndex,cardIndex:0})
	}
}
console.log("final",game.getScore(0))