package socket

import akka.actor.{ Actor, ActorRef, Props }
import de.htwg.se.msiwar.aview.MainApp.controller
import de.htwg.se.msiwar.controller._
import utils.JsonConverter

import scala.swing.Reactor

class WebSocketActor(out: ActorRef) extends Actor with Reactor {
  listenTo(controller)

  override def receive: Receive = {
    // at the moment msg is ignored and we sent always game board as json
    case _: String => sendJson()
  }

  reactions += {
    case turnStarted: TurnStarted => sendTurnStarted(turnStarted)
    case playerWon: PlayerWon => sendPlayerWon(playerWon)
    case attackResult: AttackResult => sendAttackResult(attackResult)
    case _: CellChanged => sendJson()
    case _: GameStarted => sendJson()
  }

  def sendJson(): Unit = {
    out ! JsonConverter.gameBoardToJson().toString()
  }

  def sendPlayerWon(playerWonEvent: PlayerWon): Unit = {
    out ! JsonConverter.playerWonToJson(playerWonEvent).toString()
  }

  def sendTurnStarted(turnStarted: TurnStarted): Unit = {
    out ! JsonConverter.turnStartedToJson(turnStarted).toString()
  }

  def sendAttackResult(attackResult: AttackResult): Unit = {
    out ! JsonConverter.attackResultToJson(attackResult).toString()
  }
}

object WebSocketActor {
  def props(out: ActorRef) = Props(new WebSocketActor(out))
}
