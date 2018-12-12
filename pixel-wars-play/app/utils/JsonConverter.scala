package utils

import de.htwg.se.msiwar.aview.MainApp.controller
import de.htwg.se.msiwar.controller.PlayerWon
import de.htwg.se.msiwar.model._
import play.api.libs.json._

import scala.collection.mutable

object JsonConverter {
  
  implicit def tuple = new Writes[(Int, Int)] {
    override def writes(o: (Int, Int)) = Json.obj(
      "rowIdx" -> o._1,
      "columnIdx" -> o._2,
    )
  }

  implicit def tuples = new Writes[List[(Int, Int)]] {
    override def writes(o: List[(Int, Int)]): JsValue = {
      JsArray(o.map(Json.toJson(_)))
    }
  }

  implicit def gameObject = new Writes[GameObject] {
    def writes(playerObject: GameObject) = Json.obj(
      "rowIdx" -> playerObject.position.rowIdx,
      "columnIdx" -> playerObject.position.columnIdx,
      "imagePath" -> playerObject.imagePath,
    )
  }

  implicit def gameObjects = new Writes[List[GameObject]] {
    def writes(o: List[GameObject]): JsValue = {
      JsArray(o.map(Json.toJson(_)))
    }
  }

  implicit def playerWon = new Writes[PlayerWon] {
    override def writes(playerWon: PlayerWon): JsValue = {
      Json.obj(
        "eventType" -> PlayerWon.getClass.getSimpleName,
        "playerNumber" -> playerWon.playerNumber,
        "wonImagePath" -> playerWon.wonImagePath,
      )
    }
  }

  def playerWonToJson(playerWonEvent: PlayerWon) : JsValue = {
    playerWon.writes(playerWonEvent)
  }

  def gameBoardToJson() : JsValue = {
    val list = mutable.MutableList[GameObject]()
    for(row <- 0 until controller.rowCount) {
      for(col <- 0 until controller.columnCount) {
        val gameObjectOpt = controller.cellContent(row,col)
        if(gameObjectOpt.isDefined) {
          list += gameObjectOpt.get
        }
      }
    }
    JsonConverter.gameObjects.writes(list.toList)
  }
}