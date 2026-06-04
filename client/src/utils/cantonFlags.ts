import aargau from "../images/Wappen-Aargau.svg";
import appenzellAusserrhoden from "../images/Wappen-Appenzell-Ausserrhoden.svg";
import appenzellInnerrhoden from "../images/Wappen-Appenzell-Innerrhoden.svg";
import baselLandschaft from "../images/Wappen-Basel-Landschaft.svg";
import baselStadt from "../images/Wappen-Basel-Stadt.svg";
import bern from "../images/Wappen-Bern.svg";
import freiburg from "../images/Wappen-Freiburg.svg";
import genf from "../images/Wappen-Genf.svg";
import glarus from "../images/Wappen-Glarus.svg";
import graubuenden from "../images/Wappen-Graubünden.svg";
import jura from "../images/Wappen-Jura.svg";
import luzern from "../images/Wappen-Luzern.svg";
import neuenburg from "../images/Wappen-Neuenburg.svg";
import nidwalden from "../images/Wappen-Nidwalden.svg";
import obwalden from "../images/Wappen-Obwalden.svg";
import schaffhausen from "../images/Wappen-Schaffhausen.svg";
import schwyz from "../images/Wappen-Schwyz.svg";
import solothurn from "../images/Wappen-Solothurn.svg";
import stGallen from "../images/Wappen-St.-Gallen.svg";
import tessin from "../images/Wappen-Tessin.svg";
import thurgau from "../images/Wappen-Thurgau.svg";
import uri from "../images/Wappen-Uri.svg";
import waadt from "../images/Wappen-Waadt.svg";
import wallis from "../images/Wappen-Wallis.svg";
import zug from "../images/Wappen-Zug.svg";
import zuerich from "../images/Wappen-Zürich.svg";

const cantonFlagMap: Record<string, ImageMetadata> = {
  "1": zuerich,
  "2": bern,
  "3": luzern,
  "4": uri,
  "5": schwyz,
  "6": obwalden,
  "7": nidwalden,
  "8": glarus,
  "9": zug,
  "10": freiburg,
  "11": solothurn,
  "12": baselStadt,
  "13": baselLandschaft,
  "14": schaffhausen,
  "15": appenzellAusserrhoden,
  "16": appenzellInnerrhoden,
  "17": stGallen,
  "18": graubuenden,
  "19": aargau,
  "20": thurgau,
  "21": tessin,
  "22": waadt,
  "23": wallis,
  "24": neuenburg,
  "25": genf,
  "26": jura,
};

export function getCantonFlag(uri: string): ImageMetadata | undefined {
  const id = uri.split("/").pop();
  return id ? cantonFlagMap[id] : undefined;
}
