package socket

import akka.actor.{Actor, ActorRef, Props}
import de.htwg.se.msiwar.aview.MainApp.controller
import utils.JsonConverter

import scala.swing.Reactor

class WebSocketActor(out: ActorRef) extends Actor with Reactor{
  listenTo(controller)

  override def receive: Receive = {
    // at the moment msg is ignored and we sent always game board as json
    case msg: String => out ! sendJson
  }

  def sendJson() = {
    out ! JsonConverter.gameBoardToJson()
  }
}

object WebSocketActor{
  def props(out: ActorRef) = Props(new WebSocketActor(out))
}
