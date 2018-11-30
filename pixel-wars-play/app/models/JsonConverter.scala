package models

import de.htwg.se.msiwar.model.{BlockObject, Position}
import play.api.libs.json.Json

object JsonConverter {
  implicit def positionFormat = Json.format[Position]
  implicit def blockFormat = Json.format[BlockObject]
}