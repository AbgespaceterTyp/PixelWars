package socket

import akka.actor.{Actor, ActorRef, Props}
import de.htwg.se.msiwar.aview.MainApp.controller
import de.htwg.se.msiwar.controller._
import utils.JsonConverter

import scala.swing.Reactor

class WebSocketActor(out: ActorRef) extends Actor with Reactor{
  listenTo(controller)

  override def receive: Receive = {
    // at the moment msg is ignored and we sent always game board as json
    case _: String => out ! sendJson()
  }

  reactions += {
    case _: CellChanged => sendJson()
    case _: TurnStarted => sendJson()
    case _: PlayerWon => sendPlayerWon(_)
    case _: GameStarted => sendJson()
    case _: AttackResult => sendJson()
  }

  def sendJson() : Unit = {
    out ! JsonConverter.gameBoardToJson().toString()
  }

  def sendPlayerWon(playerWonEvent: PlayerWon) : Unit = {
    out ! JsonConverter.playerWonToJson(playerWonEvent).toString()
  }
}

object WebSocketActor{
  def props(out: ActorRef) = Props(new WebSocketActor(out))
}
