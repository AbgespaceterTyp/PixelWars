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
    case msg: String => out ! sendJson
  }

  // TODO send event specific content
  reactions += {
    case _: CellChanged => sendJson()
    case _: TurnStarted => sendJson()
    case _: PlayerWon => sendJson()
    case _: GameStarted => sendJson()
    case _: AttackResult => sendJson()
  }

  def sendJson() = {
    out ! JsonConverter.gameBoardToJson()
  }
}

object WebSocketActor{
  def props(out: ActorRef) = Props(new WebSocketActor(out))
}
