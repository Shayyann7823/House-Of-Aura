"use client";
import { useEffect, useState } from "react";
// Alternating: 1 man, 1 woman, repeat — based on your carousel folder
const CAROUSEL_IMAGES = [
  "/carousel/Man_adjusting_cuff_smiling_202607212151.jpeg",
  "/carousel/Woman_in_jeans_and_shirt_202607212144.jpeg",
  "/carousel/Man_in_festive_kurta_standing_202607212150.jpeg",
  "/carousel/Woman_in_Pakistani_suit_seated_202607212142.jpeg",
  "/carousel/Man_in_kurta_pajama_waistcoat_202607212150.jpeg",
  "/carousel/Woman_in_Pakistani_suit_standing_202607212142.jpeg",
  "/carousel/Man_in_kurta_shalwar_standing_202607212151.jpeg",
  "/carousel/Woman_in_white_blouse_charcoal_202607212144.jpeg",
  "/carousel/Man_in_kurta_shalwar_studio_202607212150.jpeg",
  "/carousel/Woman_leaning_against_wall_202607212144.jpeg",
  "/carousel/Man_in_polo_shirt_grey_202607221208.jpeg",
  "/carousel/Woman_touching_hair_window_202607212144.jpeg",
  "/carousel/Man_in_sweater_and_trousers_202607221208.jpeg",
  "/carousel/Woman_walking_in_apartment_202607212144.jpeg",
  "/carousel/Man_in_white_shirt_jeans_202607221208.jpeg",
  "/carousel/Woman_walking_in_city_street_202607212144.jpeg",
  "/carousel/Man_leaning_against_wall_202607221208.jpeg",
  "/carousel/Woman_walking_in_office_lobby_202607212144.jpeg",
  "/carousel/Man_walking_in_garden_202607212150.jpeg",
  "/carousel/Woman_walking_in_Pakistani_suit_202607212142.jpeg",
  "/carousel/Man_walking_in_hotel_lobby_202607212151.jpeg",
  "/carousel/Woman_walking_in_Pakistani_suit_202607212145.jpeg",
  "/carousel/Man_walking_in_office_lobby_202607221208.jpeg",
  "/carousel/Woman_walking_in_summer_suit_202607212142.jpeg",
  "/carousel/Man_walking_toward_camera_202607221208.jpeg",
  "/carousel/Woman_wearing_Pakistani_lawn_suit_202607212142.jpeg",
];

export function FounderCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % CAROUSEL_IMAGES.length);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative aspect-[4/5] overflow-hidden bg-muted">
      {CAROUSEL_IMAGES.map((src, i) => (
        <img
          key={src}
          src={src}
          alt="House of Aura model"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
}