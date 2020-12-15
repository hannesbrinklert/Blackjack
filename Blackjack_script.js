/*
                    THE GAME
                                                                                                                              */
//Skapa dom globala variablerna som behövs
var cards =
["hjarter_tva", "hjarter_tre", "hjarter_fyra", "hjarter_fem", "hjarter_sex", "hjarter_sju", "hjarter_atta", "hjarter_nio", "hjarter_tio", "hjarter_knekt",            "hjarter_dam", "hjarter_kung", "hjarter_ess",
    "ruter_tva", "ruter_tre", "ruter_fyra", "ruter_fem", "ruter_sex", "ruter_sju", "ruter_atta", "ruter_nio", "ruter_tio", "ruter_knekt", "ruter_dam", "ruter_kung", "ruter_ess",
    "spader_tva", "spader_tre", "spader_fyra", "spader_fem", "spader_sex", "spader_sju", "spader_atta", "spader_nio", "spader_tio", "spader_knekt", "spader_dam", "spader_kung", "spader_ess",
    "klover_tva", "klover_tre", "klover_fyra", "klover_fem", "klover_sex", "klover_sju", "klover_atta", "klover_nio", "klover_tio", "klover_knekt", "klover_dam", "klover_kung", "klover_ess"
];

//objekt variablerna för dealern, spelaren och spelet.
var player;
var dealer;
var game;

//Så fort sidan laddas ska detta hända
window.onload = function(){newGame(false);};

//Förbereder ett nytt spel.
function newGame(window)
{
   //Om spelaren har vunnit eller förlorat och spelar igen kommer den hit.
   if(window === true)
   {
      document.getElementById("popUp2").style.display = "none";
      document.getElementById("restartButton").style.display = "none";
      document.getElementById("popUpText").style.display = "none";
   }

   //Sätter variablerna till varje nytt spel.
   game = new gameBlackJack(500, 0, false, false, 0);

   //Fixar knappar, värden och input för ett nytt spel.
   document.getElementById("player").innerHTML = "";
   document.getElementById("dealer").innerHTML = "";
   document.getElementById("cardCountingBox").innerHTML = "0";
   document.getElementById("level").innerHTML = "";
   document.getElementById("nextLvl").innerHTML = "";
   document.getElementById("betSize").disabled = false;
   document.getElementById("betSize").value = "";
   document.getElementById("buttonZero").disabled = false;
   document.getElementById("buttonOne").disabled = false;
   document.getElementById("buttonTwo").disabled = true;
   document.getElementById("buttonThree").disabled = true;

   //sätter korten på rätt plats så att dom senare kan animeras
   positionCards();
   //uppdaterar spelarens level och skiver ut den på skärmen
   updatePlayerLevel();
   //blanda korten
   cardShuffle();
   //Sätter alla bilder till en transparentbild.
   clearPictures();
   //Man får klicka på markerna.
   updateMarkers(true);
   //Man får inte ta ett kort.
   updatePic(false);

   document.getElementById("money").innerHTML = game.money;
   document.getElementById("betSize").max = game.money;
   document.getElementById("infoToUser").innerHTML = ("Welcome to HaMaBlackjack!");
}

//function som skapar objekten spelaren och dealern (a constructor)
function blackJackPlayer(hand,handValueBig,handValueSmall,newHandValue,ess)
{
  this.hand = hand;
  this.handValueBig = handValueBig;
  this.handValueSmall = handValueSmall;
  this.newHandValue = newHandValue;
  this.ess = ess;
}

//function som skapar objektet game (a constructor)
function gameBlackJack(money, cardCount, takeCard, markers, whichButton)
{
   this.money = money;
   this.cardCount = cardCount;
   this.takeCard = takeCard;
   this.markers = markers;
   this.whichButton = whichButton;
}

//Kallas när användaren klickar på knappen deal.
function newHand()
{
   //sätt bet till det som står i betSize rutan.
   newHand.bet = parseInt(document.getElementById("betSize").value);

   var boBet = checkBet(newHand.bet);

   //Kollar om det användaren bettar är okej, om inte hopppar man ur funktionen.
   if(boBet === false)
      return;

   updateMoney(newHand.bet, "");

   //Stänger av knappar och tar bort texten i informationen till användaren.
   document.getElementById("infoToUser").innerHTML = ("&nbsp;");
   document.getElementById("buttonZero").disabled = true;
   document.getElementById("buttonOne").disabled = true;
   document.getElementById("betSize").disabled = true;

   //Stänger av markerna.
   updateMarkers(false);

   //sätt alla varibler till det dom ska vara då en ny hand ges ut.
   player = new blackJackPlayer([],0,0,0,false);
   dealer = new blackJackPlayer([],0,0,0,false);

   //ta bort bilderna från förra handen och dela ut kort 2 kort till dig och 2 till dealern.
   clearPictures();
   dealOutStartCards();

   //kolla om spelaren fått blackjack, annars akiveras knapparna om du vill ta nya kort eller inte.
   checkBlackjack();
}

//Ger ut dom kort som behövs vid starten av en ny hand
function dealOutStartCards()
{
   dealCards(player.hand, 0, false, "player");
   dealCards(dealer.hand, 200, true, "dealer");
   dealCards(player.hand, 400, false, "player");
   dealCards(dealer.hand, 600, false, "dealer");
}

//Funktionen som lägger kort i spelarens eller dealerns hand.
function dealCards(hand, time, turned, whoPlays)
{
   //om kortet är det andra efter att en ny hand har börjats
   if (turned === true)
   {
      //spara kortet i dealerTurnedCard och ge dealern ett kort upp och ner vänt.
      dealCards.dealerTurnedCard = cards[game.cardCount];
      hand.push("backside");
   }
   else
   {
      hand.push(cards[game.cardCount]);
      cardCounting(hand[hand.length-1]);
   }

   //fixa så att nästa kort tas nästa gång och uppdaterar variabler på skärmen beroende på vem som spelar.
   game.cardCount++;

   if(whoPlays.includes("player") === true)
      updatePlayer(hand, time);
   else
      updateDealer(hand, time);
}

//Användaren får ett kort om man klickar på kortleken.
function getNewCard()
{
   //Avgör om användaren får ta kort eller inte.
   if(game.takeCard === true)
   {
     //ger ut ett kort till dig och kollar sen om ditt värde är över 21, annars får du klicka igen.
     dealCards(player.hand, 0, false, "player");

     if(player.ess === true)
     {
        //Om spelaren har ess, kontrolleras de två olika värderna.
        if (player.handValueBig > 21 && player.handValueSmall > 21)
        {
           updatePic(false);
           whoWins(true);
        }
     }
     else
     {
        if (player.handValueBig > 21)
        {
           updatePic(false);
           whoWins(true);
        }
     }
   }
}

//Händer när knappen stand klickas.
function dealerTurn()
{
   //stäng av knapparna och vänd på dealern upp o ner vända kort.
   document.getElementById("buttonTwo").disabled = true;
   updatePic(false);
   turnOverDealerCard();

   var i = 1;
   var loopCondition = dealer.handValueBig < 17;

   // så länge dealern har undet < 17 så tar hen ett nytt kort.
   while(loopCondition)
   {
      dealCards(dealer.hand,i * 400, false, "dealer");
      i++;
      //loopCondition byts om värdet är över 21 och om dealern har ess.
      if(dealer.handValueBig > 21 && dealer.ess === true)
         loopCondition = dealer.handValueSmall < 17;
      else
         loopCondition = dealer.handValueBig < 17;
   }

   //detta till funktionen om vem som vinner, samt skriver ut.
   setTimeout(function() { whoWins(false); },(dealer.hand.length-2) * 700);
}

//Bestämmer vem som vinner.
function whoWins(bBust)
{
   //Användaren fick över 21.
   if(bBust === true)
   {
      document.getElementById("infoToUser").innerHTML = ("Bust, you lost and you went over 21!");
      turnOverDealerCard();

      //Förbereder en ny runda.
      newRound("lose");
   }

   else
   {
      //Bestämmer bästa värde för dealern.
      dealer.newHandValue = chooseSum(dealer.handValueBig, dealer.handValueSmall, dealer.ess);

      if(dealer.newHandValue > 21)
      {
         document.getElementById("infoToUser").innerHTML = ("You won and the dealer bust!");
         updateMoney(newHand.bet, "win");
         newRound("");
      }
      else
      {
         //Bestämmer bästa värde för spelaren.
         player.newHandValue = chooseSum(player.handValueBig, player.handValueSmall, player.ess);

         if(dealer.newHandValue >= player.newHandValue)
         {
            document.getElementById("infoToUser").innerHTML = ("You lost, you had " + player.newHandValue + " and the dealer had " + dealer.newHandValue + "!");
            newRound("lose");
         }
         else
         {
            document.getElementById("infoToUser").innerHTML = ("You won, you had " + player.newHandValue + " and the dealer had " + dealer.newHandValue + "!");
            updateMoney(newHand.bet, "win");
            newRound("");
         }
      }
   }
}

//Förbereder en ny omgång.
function newRound(outCome)
{
   //Kollar om användaren har förlorat.
   if(outCome.includes("lose") === true && game.money <= 0)
      wantNewGame("");
   else
   {
      //Sätter maxbet med pengarna.
      document.getElementById("betSize").max = game.money;
      //Sätter på vissa knappar och stänger av vissa för en ny omgång.
      document.getElementById("buttonZero").disabled = false;
      document.getElementById("buttonOne").disabled = false;
      document.getElementById("buttonTwo").disabled = true;
      document.getElementById("betSize").disabled = false;
      updateMarkers(true);
      resetBet();

      //Kollar om kortleken ska blandas om.
      if (game.cardCount > 42)
         cardShuffle();
   }
}

//returnerar värdet på dett kort som skickas in (namnet på kortet)
function getCardValue(cardName)
{
    //Sätt en temp. var cardValue och en var cardIndex som blir texten efter "_" hos namnet på kortet.
   var cardValue;
   var cardIndex = cardName.substring(cardName.indexOf("_") + 1);
   //Sätt cardValue till det värde som kortet har enligt texten efter "_".
   switch (cardIndex)
   {
      case "tva":
         cardValue = 2;
         break;
      case "tre":
         cardValue = 3;
         break;
      case "fyra":
         cardValue = 4;
         break;
      case "fem":
         cardValue = 5;
         break;
      case "sex":
         cardValue = 6;
         break;
      case "sju":
         cardValue = 7;
         break;
      case "atta":
         cardValue = 8;
         break;
      case "nio":
         cardValue = 9;
         break;
      case "ess":
         cardValue = 1;
         break;
      case "kung":
      case "dam":
      case "knekt":
      case "tio":
         cardValue = 10;
         break;
      default:
         cardValue = 0;
   }
   return cardValue;
}

//Vänd på dealerns kort och uppdatera bilderna på skärmen samt variabler för dealern.
function turnOverDealerCard()
{
   dealer.hand[0] = dealCards.dealerTurnedCard;
   cardCounting(dealer.hand[0]);
   updateDealer("", 0, "dealer");
}

//Kollar om användaren får blackjack, om inte sätts knapp och kortleken på.
function checkBlackjack()
{
   if(player.handValueBig == 21)
   {
      updateMoney(newHand.bet, "blackjack");
      document.getElementById("infoToUser").innerHTML = ("You got Blackjack!");
      newRound("");
   }
   else
   {
      document.getElementById("buttonTwo").disabled = false;
      updatePic(true);
   }
}

//Om anvädaren vinner eller förlorar så blir hen förfrågad om hen vill spela igen.
function wantNewGame(outCome)
{
   //Animerar fram popup bakgrunden.
   animationInfo("popUp2");

   //Kollar om användaren vann eller förlorade och ändrar texten efter det.
   if(outCome.includes("win") === true)
      document.getElementById("popUpText").innerHTML = "You won!";
   else
      document.getElementById("popUpText").innerHTML = "Game over!";
   //Animerar fram knappen och text.
   animationInfoTwo("popUpText", "restartButton");
}

//Beräknar summan för antingen spelaren eller dealern.
function calculateSum(whoPlays)
{
   //Spelarens summa.
   if(whoPlays.includes("player"))
   {
      //Kollar om spelaren har ess om inte spelaren redan har fått det.
      if(player.ess === false)
         checkEss(player.hand, "player");
      //Beräknar två summor om spelaren har ess, annars beräknas en summa.
      if(player.ess === true)
      {
         player.handValueBig = bigSum(player.hand);
         player.handValueSmall = smallSum(player.hand);
      }
      else
         player.handValueBig = bigSum(player.hand);
   }
   //Dealerns summa.
   else
   {
      //Kollar om dealern har ess om inte dealern redan har fått det.
      if(dealer.ess === false)
         checkEss(dealer.hand, "dealer");
      //Beräknar två summor om dealern har ess, annars beräknas en summa.
      if(dealer.ess === true)
      {
         dealer.handValueBig = bigSum(dealer.hand);
         dealer.handValueSmall = smallSum(dealer.hand);
      }
      else
         dealer.handValueBig = bigSum(dealer.hand);
   }
}

//Kollar om det finns ess i spelarens eller dealerns hand.
function checkEss(hand, whoPlays)
{
   for(var i = 0; i < hand.length; i++)
   {
      var u = hand[i];

      if(u.includes("ess"))
      {
      i = hand.length;

      if(whoPlays.includes("player"))
         player.ess = true;
      else
         dealer.ess = true;
      }
   }
}

//Beräknar den stösta summan spelarens eller dealerns hand kan ha.
function bigSum(hand)
{
   var sum = 0;

   var bEss = false;

   for(var i = 0; i < hand.length;i++)
   {
      var j = hand[i];
      if(j.includes("ess") && bEss === false)
      {
         sum += 11;
         bEss = true;
      }
      else
         sum += getCardValue(hand[i]);
      }
   return sum;
}

//Beräknar den minsta summan spelarens eller dealerns hand kan ha.
function smallSum(hand)
{
   var sum = 0;
   for(var i = 0; i < hand.length; i++)
   {
   	sum += getCardValue(hand[i]);
   }
   return sum;
}

//Väljer de värdet som är störst men som inte är större än 21 om det finns ess i handen.
//Båda är större är större än 21 så kommer den minsta av dem ut.
//Om det inte finns ess så det största värde ut.
//Väljer det största värdet på summan om inget ess finns eftersom ena är noll då den inte beräknas.
function chooseSum(sum, sum1, bEss)
{
   var rightSum;
   if(bEss === true)
   {
      if(sum > 21 && sum1 > 21)
      {
         if(sum < sum1)
            rightSum = sum;
         else
            rightSum = sum1;
      }
      else
      {
         if(sum > 21)
            sum = 0;
         else if(sum1 > 21)
            sum1 = 0;

         if(sum > sum1)
            rightSum = sum;
         else
            rightSum = sum1;
      }
   }
   else
   {
      if(sum1 > sum)
         rightSum = sum1;
      else
         rightSum = sum;
   }

   return rightSum;
}

//Skriver ut de/det rätta värde/värden till användaren
function writeSum(sum, sum1, whoPlays, bEss)
{
   if(bEss === false)
   {
      var sumToWrite;

      //Väljer värdet som inte är noll. Den ena summan beräknas inte när inget ess finns i handen.
      if(sum1 > sum)
         sumToWrite = sum1;
      else
         sumToWrite = sum;
   }

   if(bEss === true)
      document.getElementById(whoPlays).innerHTML = (sum1 + " or " + sum);
   else
      document.getElementById(whoPlays).innerHTML = (sumToWrite);
}

/*
        CARDSHUFFLING + CARDCOUNTING
                                            */
//blandar korten
function cardShuffle()
{
   //Sätt cardCount till 0 (vilket kort i leken som är det nästa).
   cardShuffle.cardCountingValue = 0;
   game.cardCount = 0;
   setTimeout(shufflingAnimation, 1500);
   //Stänger av betknappen och reset game kanppen.
   document.getElementById("buttonZero").disabled = true;
   document.getElementById("buttonThree").disabled = true;

   //loopa 10000 ggr
   for (var i = 0; i < 10000; i++)
   {
      // skapa 2 random var Ex. 3 och 11 , sen byts kortet på plats 11 ut mot kortet som låg på plats 3 och vise versa
      var randomOne = Math.floor(Math.random() * (cards.length));
      var randomTwo = Math.floor(Math.random() * (cards.length));
      var temp = cards[randomOne];
      cards[randomOne] = cards[randomTwo];
      cards[randomTwo] = temp;
   }
}

//Beräknar och uppdaterar värdet på cardcounting.
function cardCounting(cardname)
{
  var cardValue = getCardValue(cardname);

  if (cardValue > 1 && cardValue < 7)
    cardShuffle.cardCountingValue++;
  else if (cardValue > 9 || cardValue == 1)
    cardShuffle.cardCountingValue --;

  document.getElementById("cardCountingBox").innerHTML = cardShuffle.cardCountingValue;
}

/*
        BET RELATED CODE
                                                */
//Uppdaterar värdet i input
function picBet(newBet)
{
   if(game.markers === true)
   {
      var betInput = parseInt(document.getElementById("betSize").value);

      if(true === isNaN(betInput))
         betInput = 0;

      //Om bettet blir större än spelarens pengar, sätt värdet i input till spelarens pengar.
      if(newBet+betInput > game.money)
         document.getElementById("betSize").value = game.money;
      else
         document.getElementById("betSize").value = newBet + betInput;
   }
}

//Nollställer det som står i input
function resetBet()
{
	document.getElementById("betSize").value = "";
}

//Kollar om bettet är okej, returnerar true eller false, true är att den är okej.
function checkBet(bet)
{
   var bBet;

   //bettet är mindre än noll eller inget nummer.
   if (newHand.bet <= 0 || isNaN(newHand.bet) === true)
   {
      document.getElementById("infoToUser").innerHTML = ("Your bet must be greater than 0!");
      resetBet();
      bBet = false;
   }
   //Betten är större än spelarens pengar.
   else if (newHand.bet > game.money)
   {
      document.getElementById("infoToUser").innerHTML = ("Your bet must be smaller than or equal to " + game.money + "!");
      resetBet();
      bBet = false;
   }
   //Bettet är bra.
   else
      bBet = true;

   return bBet;
}
/*
          UPDATE RELATED CODE
                                            */
//Uppdaterar spelarens kort och värden.
function updatePlayer(hand, time)
{
   cardPictures(hand,time);
   calculateSum("player");
   writeSum(player.handValueBig, player.handValueSmall, "player", player.ess);
}

//Uppdaterar dealerns kort och värden.
function updateDealer(hand, time)
{
   cardPictures(hand,time);
   calculateSum("dealer");
   writeSum(dealer.handValueBig, dealer.handValueSmall, "dealer", dealer.ess);
}

//Uppdaterar kanten beroende på om variabeln takeCard är sant eller falskt.
function updatePic(bCard)
{
   game.takeCard = bCard;

   if(game.takeCard === true)
   {
      document.getElementById("kortlek").style.border = "5px solid green";
   }
   else if(game.takeCard === false)
   {
      document.getElementById("kortlek").style.border = "5px solid red";
   }
}

//Uppdaterar värdet på pengar, uppdaterar level och skriver ut det på skärmen.
function updateMoney(bet, outCome)
{
   switch(outCome)
   {
      case "blackjack":
         game.money += 3 * bet;
         break;

      case "win":
         game.money += 2 * bet;
         break;

      default:
         game.money -= bet;
         break;
   }
   document.getElementById("money").innerHTML = game.money;
   updatePlayerLevel();
}

//Uppdaterar kanten beroende på om variabeln markers är sant eller falskt.
function updateMarkers(bMarkers)
{
   game.markers = bMarkers;

   if(game.markers === true)
   {
      document.getElementById("markerOne").style.border = "5px solid green";
      document.getElementById("markerTwo").style.border = "5px solid green";
      document.getElementById("markerThree").style.border = "5px solid green";
   }
   else if(game.markers === false)
   {
      document.getElementById("markerOne").style.border = "5px solid red";
      document.getElementById("markerTwo").style.border = "5px solid red";
      document.getElementById("markerThree").style.border = "5px solid red";
   }
}

/*
      SHOW OR DON'T SHOW THE CARDS
                                                      */

//funktionen som skriver ut bilderna på korten.
function cardPictures(hand, time)
{
   var i = hand.length-1;

   if (hand == player.hand)
   {
      document.getElementById("kort" + i).src = "Cards/" + hand[i] + ".png";
      document.getElementById("kort" + i).style.border = "3px solid black";
      setCard("kort" + i,time);
   }
   else if (hand == dealer.hand)
   {
      document.getElementById("dealerKort" + i).src = "Cards/" + hand[i] + ".png";
      document.getElementById("dealerKort" + i).style.border = "3px solid black";
      setCard("dealerKort" + i,time);
   }
   else
      document.getElementById("dealerKort" + 0).src = "Cards/" + dealer.hand[0] + ".png";
}

//Ta bort bilderna på skärmen genom att sätta src till en osynligbild.
function clearPictures()
{
   for (var i = 0; i < 11; i++)
   {
      var platsEtt = document.getElementById("kort" + i);
      var platsTva = document.getElementById("dealerKort" + i);
      platsEtt.src = "andraBilder/nothing.png";
      platsEtt.style.border = "";
      platsTva.src = "andraBilder/nothing.png";
      platsTva.style.border = "";
   }
}

/*
              ANIMATIONS
                                                          */
//funktionen som placerar ut korten och förbereder dom för att bli animerade.
function setCard(cardId,time)
{
   //dom olika elementen
   var card = document.getElementById(cardId);
   var kortlek = document.getElementById("kortlek");

   //sätt top och right till positionen där kortet är just nu, sätt currentTop o Right till positionen för kortleken.
   var top = parseInt(card.style.top);
   var left = parseInt(card.style.left);
   var currentleft = parseInt(kortlek.style.left);
   var currentTop = parseInt(kortlek.style.top);

   //spara bilden och sätt bilden till baksidan av ett kort.
   var cardSrc = card.src;
   card.src = "Cards/backside.png";

   //Sätt kortets position till kortlekens position och kalla på funktionen moveCard efter en viss tid.
   card.style.top = currentTop + "px";
   card.style.left = currentleft + "px";
   setTimeout(moveCard, time);

   //funktionen som flyttar kortet.
   function moveCard()
   {
      //bestämmer hur mycket kortet ska flytta sig varje "steg".
      var leftIncrease = (currentleft-left)/130;
      var topIncrease = (currentTop-top)/130;

      //Sätt hur lång tid det ska vara mellan varje "steg". och kalla på funktionen move med denna interval.
      var timeInterval = Math.abs(topIncrease) * 1;
      var moveInterval = setInterval(move, timeInterval);

      //funktionen som flyttar kortet ett "steg".
      function move()
      {
         //om kortet är på rätt plats så avslutas intervalen och bilden återställs, annars flyttas    kortet ett "steg".
         if (currentTop == top)
         {
            clearInterval(moveInterval);
            card.src = cardSrc;
         }
         else
         {
            currentleft -= leftIncrease;
            currentTop -= topIncrease;
            card.style.top = currentTop + "px";
            card.style.left = currentleft + "px";
         }
      }
   }
}

//Animerar text när kortleken blandas.
function shufflingAnimation()
{
   var i = 0;
   var j = 0;
   var text = "Shuffling...";
   var moveDotsInterval = setInterval(moveDots,80);
   function moveDots()
   {
     switch(i){
        case 0:
          document.getElementById("infoToUser").innerHTML = "";
          break;
        default:
          document.getElementById("infoToUser").innerHTML += text.charAt(i-1);
          break;
        case 13:
          i = (-1);
          j++;
      }
      i++;
      if (j == 4)
      {
         clearInterval(moveDotsInterval);
         document.getElementById("infoToUser").innerHTML = "Done!";

         //Sätter på betknappen och reset game knappen.
         document.getElementById("buttonZero").disabled = false;
         document.getElementById("buttonThree").disabled = false;
      }
   }
 }

/*
    THIS IS WHERE THE CARDS ARE PLACED IN THE RIGHT SLOTS TO LATER BE ANIMATED
                                                                                    */
//Positionerar spelarens och dealerns kort.
function positionCards()
{
   for (var i = 0; i < 11; i++)
   {
      var card = document.getElementById("kort" + i);
      card.style.top = (570) + "px";
      card.style.left = (540 + i * 34) + "px";
      card.style.zIndex = i;

      card = document.getElementById("dealerKort" + i);
      card.style.top = (50) + "px";
      card.style.left = (540 + i * 34) + "px";
      card.style.zIndex = i;
   }
}
/*
    DETERMINES THE PLAYER LEVEL BASED ON THE AMOUNT OF MONEY THE PLAYER HAS
                                                                                      */
//Bestämmer spelarens level och skriver ut den på skärmen.
function updatePlayerLevel()
{
   //Största talet som finns i javascript.
   var bigNumber = Number.MAX_VALUE;
   //De olika levlerna.
   var levels = [1, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 128000, 256000, bigNumber];
   var playerLevel = 0;
   var j = 1;

   for(var i = 0; i < levels.length; i++)
   {
      //Kollar om spelarns pengar är mellan två levlar.
      if(game.money >= levels[i] && game.money < levels[j])
      {
         playerLevel = j;

         //Avslutar loopen när leveln är hittat.
         i = levels.length;
      }
      //Om spelarens level är 10 vinner spelaren.
      if(playerLevel == 10)
      {
         wantNewGame("win");
         document.getElementById("level").innerHTML = playerLevel;
         document.getElementById("nextLvl").innerHTML = 0;
         return;
      }

      j++;
   }

   //Skriver ut värden till skärmen.
   document.getElementById("level").innerHTML = playerLevel;
   document.getElementById("nextLvl").innerHTML = levels[playerLevel] - game.money;
}


/*
      CODE RELATED TO THE INFO BUTTON AND WHAT HAPPENS WHEN IT IS PRESSED
                                                                                */

//Visar en pop up, tar bort infoknapp, visar stängknapp och visar en bakgrund.
function infoZero()
{
   //Nollställer whichButton så att nästa funktion som kallas när man klickar på nästa knappen blir rätt funktion.
   game.whichButton = 0;

   //Ändrar tillbaka att det ska stå next i knappen om man kollar på information om speler flera gånnger.
   document.getElementById("boxButton").innerHTML = "Next";
   document.getElementById("infoButton").style.display = "none";

   //Animerar fram knappar och boxen.
   animationInfo("boxZero");
   animationInfo("close");
   animationInfo("boxButton");

   document.getElementById("popUp").style.display = "block";
}

//Visar en pil och en box med information i.
function infoOne ()
{
   //Hämtar element.
   var elem = document.getElementById("knappar");

   //Bestämmer position för pilen.
   var x =  elem.offsetLeft - 160;
   var y = elem.offsetTop - 130;

   //Anger position för pilen.
   document.getElementById("arrowOne").style.top = y + "px";
   document.getElementById("arrowOne").style.left = x + "px";

   //Bestämmer boxens position utifrån pilens position.
   var xBox = x - 210;
   var yBox = y - 60;

   //Anger position för boxen.
   document.getElementById("boxOne").style.top = yBox + "px";
   document.getElementById("boxOne").style.left = xBox + "px";

   //Animerar fram boxen och pilen.
   animationInfoTwo("arrowOne", "boxOne");

   //Kallar på en funktion efter 1, 2 och 3 sekunder.
   setTimeout(infoTwo, 1000);
   setTimeout(infoThree, 2000);
   setTimeout(infoFour, 3000);
}

//Visar en pil och en box med information i.
function infoTwo ()
{
   var str = document.getElementById("close").style.display;

   //Om denna inte är sann så har användaren klickat på stängknappen eller klickat på nästaknappen.
   if(str.includes("block") === true && game.whichButton === 1)
   {
      //Hämtar element.
      var elem = document.getElementById("picMarker");

      //Bestämmer position för pilen.
      var x =  elem.offsetLeft - 140;
      var y = elem.offsetTop - 140;
      //Anger position för pilen.
      document.getElementById("arrowTwo").style.top = y + "px";
      document.getElementById("arrowTwo").style.left = x + "px";

      //Bestämmer boxens position utifrån pilens position.
      var xBox = x - 210;
      var yBox = y - 60;

      //Anger position för boxen.
      document.getElementById("boxTwo").style.top = yBox + "px";
      document.getElementById("boxTwo").style.left = xBox + "px";

      //Animerar fram boxen och pilen.
      animationInfoTwo("arrowTwo", "boxTwo");
   }
}

//Visar en pil och en box med information i.
function infoThree ()
{
   var str = document.getElementById("close").style.display;

   //Om denna inte är sann så har användaren klickat på stängknappen eller klickat på nästaknappen.
   if(str.includes("block") === true && game.whichButton === 1)
   {
      //Hämtar element.
      var elem = document.getElementById("knappar");

      //Bestämmer position för pilen.
      var x =  elem.offsetLeft - 160;
      var y = elem.offsetTop + 60;

      //Anger position för pilen.
      document.getElementById("arrowThree").style.top = y + "px";
      document.getElementById("arrowThree").style.left = x + "px";

      //Bestämmer boxens position utifrån pilens position.
      var xBox = x - 210;
      var yBox = y - 20;

      //Anger position för boxen.
      document.getElementById("boxThree").style.top = yBox + "px";
      document.getElementById("boxThree").style.left = xBox + "px";

      //Animerar fram boxen och pilen.
      animationInfoTwo("arrowThree", "boxThree");
	}
}

//Visar en pil och en box med information i.
function infoFour ()
{
   var str = document.getElementById("close").style.display;

   //Om denna inte är sann så har användaren klickat på stängknappen eller klickat på nästaknappen.
   if(str.includes("block") === true && game.whichButton == 1)
   {
      //Hämtar element.
      var elem = document.getElementById("knappar");

      var x =  elem.offsetLeft - 160;
      var y = elem.offsetTop - 30;

      //Anger position för pilen.
      document.getElementById("arrowFour").style.top = y + "px";
      document.getElementById("arrowFour").style.left = x + "px";

      //Bestämmer boxens position utifrån pilens position.
      var xBox = x - 210;
      var yBox = y - 50;
      //Anger position för boxen.
      document.getElementById("boxFour").style.top = yBox + "px";
      document.getElementById("boxFour").style.left = xBox + "px";

      //Animerar fram boxen och pilen.
      animationInfoTwo("arrowFour", "boxFour");
   }
}

//Visar en pil och en box med information i.
function infoFive ()
{
  //Hämtar element.
   var elem = document.getElementById("kort0");

   //Bestämmer position för pilen.
   var x = parseInt(elem.style.left) - 100;
   var y = parseInt(elem.style.top) - 170;

   //Anger position för pilen.
   document.getElementById("arrowFive").style.top = y + "px";
   document.getElementById("arrowFive").style.left = x + "px";

   //Bestämmer boxens position utifrån pilens position.
   var xBox = x - 200;
   var yBox = y - 110;

   //Anger position för boxen.
   document.getElementById("boxFive").style.top = yBox + "px";
   document.getElementById("boxFive").style.left = xBox + "px";

   //Animerar fram boxen och pilen.
   animationInfoTwo("arrowFive", "boxFive");

   //Kallar på en funktion efter 1 sekund.
   setTimeout(infoSix, 1000);
}

//Visar en pil och en box med information i.
function infoSix ()
{
   var str = document.getElementById("close").style.display;

   //Om denna inte är sann så har användaren klickat på stängknappen eller klickat på nästaknappen.
   if(str.includes("block") === true && game.whichButton == 2)
   {
      //Hämtar element.
      var elem = document.getElementById("dealerKort0");

      //Bestämmer position för pilen.
      var x = parseInt(elem.style.left) + 150;
      var y = parseInt(elem.style.top) + 180;

      //Anger position för pilen.
      document.getElementById("arrowSix").style.top = y + "px";
      document.getElementById("arrowSix").style.left = x + "px";

      //Bestämmer boxens position utifrån pilens position.
      var xBox = x + 150;
      var yBox = y + 150;

      //Anger position för boxen.
      document.getElementById("boxSix").style.top = yBox + "px";
      document.getElementById("boxSix").style.left = xBox + "px";

      //Animerar fram boxen och pilen.
      animationInfoTwo("arrowSix", "boxSix");
   }
}

//Visar en pil och en box med information i.
function infoSeven ()
{
   //Hämtar element.
   var elem = document.getElementById("cardCountingBox");

   //Bestämmer position för pilen.
   var x =  elem.offsetLeft + 110;
   var y = elem.offsetTop + 120;

   //Anger position för pilen.
   document.getElementById("arrowSeven").style.top = y + "px";
   document.getElementById("arrowSeven").style.left = x + "px";

   //Bestämmer boxens position utifrån pilens position.
   var xBox = x + 150;
   var yBox = y + 60;

   //Anger position för boxen.
   document.getElementById("boxSeven").style.top = yBox + "px";
   document.getElementById("boxSeven").style.left = xBox + "px";

   //Animerar fram boxen och pilen.
   animationInfoTwo("arrowSeven", "boxSeven");
}

//Visar en pil och en box med information i.
function infoEight ()
{
   //Hämtar element.
   var elem = document.getElementById("kortlek");

   //Bestämmer position för pilen.
   var x =  elem.offsetLeft - 155;
   var y = elem.offsetTop - 155;

   //Anger position för pilen.
   document.getElementById("arrowEight").style.top = y + "px";
   document.getElementById("arrowEight").style.left = x + "px";

   //Bestämmer boxens position utifrån pilens position.
   var xBox = x - 205;
   var yBox = y - 75;

   //Anger position för boxen.
   document.getElementById("boxEight").style.top = yBox + "px";
   document.getElementById("boxEight").style.left = xBox + "px";

   //Animerar fram boxen och pilen.
   animationInfoTwo("arrowEight", "boxEight");
}

//Visar en pil och en box med information i.
function infoNine ()
{
  //Hämtar element.
   var elem = document.getElementById("knappar");

   //Bestämmer position för pilen.
   var x = elem.offsetLeft - 160;
   var y = elem.offsetTop + 150;

   //Anger position för pilen.
   document.getElementById("arrowNine").style.top = y + "px";
   document.getElementById("arrowNine").style.left = x + "px";

   //Bestämmer boxens position utifrån pilens position.
   var xBox = x - 200;
   var yBox = y - 80;

   //Anger position för boxen.
   document.getElementById("boxNine").style.top = yBox + "px";
   document.getElementById("boxNine").style.left = xBox + "px";

   //Animerar fram boxen och pilen.
   animationInfoTwo("arrowNine", "boxNine");
}

//Visar en pil och en box med information i.
function infoTen ()
{
   //Hämtar element.
   var elem = document.getElementById("numbers");

   //Bestämmer position för pilen.
   var x =  elem.offsetLeft + 265;
   var y = elem.offsetTop + 120;

   //Anger position för pilen.
   document.getElementById("arrowTen").style.top = y + "px";
   document.getElementById("arrowTen").style.left = x + "px";

   //Bestämmer boxens position utifrån pilens position.
   var xBox = x + 150;
   var yBox = y + 150;

   //Anger position för boxen.
   document.getElementById("boxTen").style.top = yBox + "px";
   document.getElementById("boxTen").style.left = xBox + "px";


   //Animerar fram boxen och pilen.
   animationInfoTwo("arrowTen", "boxTen");
}

//Visar en pil och en box med information i.
function infoEleven ()
{
   //Hämtar element.
   var elem = document.getElementById("knappar");

   //Bestämmer position för pilen.
   var x = elem.offsetLeft - 160;
   var y = elem.offsetTop + 230;

   //Anger position för pilen.
   document.getElementById("arrowEleven").style.top = y + "px";
   document.getElementById("arrowEleven").style.left = x + "px";

   //Bestämmer boxens position utifrån pilens position.
   var xBox = x - 200;
   var yBox = y - 80;

    //Anger position för boxen.
   document.getElementById("boxEleven").style.top = yBox + "px";
   document.getElementById("boxEleven").style.left = xBox + "px";

   //Animerar fram boxen och pilen.
   animationInfoTwo("arrowEleven", "boxEleven");
}

//Stänger popupen och visar infoknappen igen.
//När man klickar på id popUp då kallas denna.
function closePopUp()
{
   reset();
   document.getElementById("close").style.display = "none";
   document.getElementById("boxButton").style.display = "none";
   document.getElementById("popUp").style.display = "none";
   document.getElementById("infoButton").style.display = "block";

}

//Tar bort det som visas på popupen förutom stäng och nästa/stängknapp.
function reset()
{
   //Tar bort alla boxar på skrämen.
   document.getElementById("boxZero").style.display = "none";
   document.getElementById("boxOne").style.display = "none";
   document.getElementById("boxTwo").style.display = "none";
   document.getElementById("boxThree").style.display = "none";
   document.getElementById("boxFour").style.display = "none";
   document.getElementById("boxFive").style.display = "none";
   document.getElementById("boxSix").style.display = "none";
   document.getElementById("boxSeven").style.display = "none";
   document.getElementById("boxEight").style.display = "none";
   document.getElementById("boxNine").style.display = "none";
   document.getElementById("boxTen").style.display = "none";
   document.getElementById("boxEleven").style.display = "none";

   //Tar bort alla pilar på skrämen.
   document.getElementById("arrowOne").style.display = "none";
   document.getElementById("arrowTwo").style.display = "none";
   document.getElementById("arrowThree").style.display = "none";
   document.getElementById("arrowFour").style.display = "none";
   document.getElementById("arrowFive").style.display = "none";
   document.getElementById("arrowSix").style.display = "none";
   document.getElementById("arrowSeven").style.display = "none";
   document.getElementById("arrowEight").style.display = "none";
   document.getElementById("arrowNine").style.display = "none";
   document.getElementById("arrowTen").style.display = "none";
   document.getElementById("arrowEleven").style.display = "none";
}

//Klickar på nästa/stängknapp och rätt funktion kallas beroende på var i informationen man är.
function nextPage()
{
   if(game.whichButton === 0)
   {
      game.whichButton++;
      reset();
      infoOne();
   }
   else if(game.whichButton == 1)
   {
      game.whichButton++;
      reset();
      infoFive();
   }
   else if(game.whichButton == 2)
   {
      game.whichButton++;
      reset();
      infoSeven();
   }
   else if(game.whichButton == 3)
   {
      game.whichButton++;
      reset();
      infoEight();
   }
   else if(game.whichButton == 4)
   {
      game.whichButton++;
      reset();
      infoNine();
   }
   else if(game.whichButton == 5)
   {
      game.whichButton++;
      reset();
      infoTen();
   }
   else if(game.whichButton == 6)
   {
      game.whichButton++;
      reset();
      infoEleven();
      //Ändrar texten på knappen så att man vet att nästa sida är sista.
      document.getElementById("boxButton").innerHTML = "Close";
   }
   else if(game.whichButton == 7)
   {
      //Avslutar popupen.
      closePopUp();
   }
}

//Animerar fram ett element.
//elemId är id på object som ska animeras.
function animationInfo (elemId)
{
   //Hömtar element.
   var elem = document.getElementById(elemId);

   //Sätter opacity till 0.
   elem.style.opacity = "0";

   var x = 0;

   //Visa element.
   elem.style.display = "block";

   //Kallar på animateOpacity varje milisekund.
   var period = setInterval(animateOpacity, 1);

   //Ökar opacity med 0.005.
   function animateOpacity()
   {
      //När opacity har blivit 1 ska funktionen sluta kallas.
      if(x >= 1)
         clearInterval(period);
      else
      {
         x += 0.005;

         //Uppdaterar opacity.
         elem.style.opacity = x;
      }
   }
}

//Animerar fram två element.
//elemId och elemIdTwo är id på object som ska animeras.
function animationInfoTwo (elemId, elemIdTwo)
{
   //Hämtar element.
   var elem = document.getElementById(elemId);
   var elemTwo = document.getElementById(elemIdTwo);

   //Sätter opacity till 0.
   elem.style.opacity = "0";
   elemTwo.style.opacity = "0";

   var x = 0;

   //Visa element.
   elem.style.display = "block";
   elemTwo.style.display = "block";

   //Kallar på animateOpacity varje milisekund.
   var period = setInterval(animateOpacity, 1);

   //Ökar opacity med 0.005.
   function animateOpacity()
   {
      //När opacity har blivit 1 ska funktionen sluta att kallas.
      if(x >= 1)
         clearInterval(period);
      else
      {
         x += 0.005;

         //Uppdaterar opacity.
         elem.style.opacity = x;
         elemTwo.style.opacity = x;
      }
   }
}
