import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { axiosInstance } from "../../../lib/axios";
import { useNavigate } from "react-router-dom";

const popularSports = [
  { id: "badminton", name: "Badminton", img: "/batminton.webp" },
  { id: "football", name: "Football", img: "/football.jpg" },
  { id: "tennis", name: "Tennis", img: "/tt.jpg" },
  { id: "badminton2", name: "Badminton", img: "/1.webp" },
  {
    id: "archery",
    name: "Archery",
    img: "https://www.shutterstock.com/image-photo/six-arows-on-archery-target-600nw-2513626239.jpg"
  },
];

export function PopularSports() {
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const [topVenuesBySport, setTopVenuesBySport] = useState({});

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const promises = popularSports.map((s) =>
          axiosInstance.get(`/users/venues`, {
            params: { sport: s.name, limit: 5 },
            signal: controller.signal,
          })
        );
        const results = await Promise.allSettled(promises);
        const map = {};
        results.forEach((res, idx) => {
          const key = popularSports[idx].id;
          if (res.status === "fulfilled") {
            map[key] = res.value?.data?.data?.venues || [];
          } else {
            map[key] = [];
          }
        });
        setTopVenuesBySport(map);
      } catch (_) {}
    })();
    return () => controller.abort();
  }, []);

  const scrollByCard = (direction) => {
    if (scrollRef.current) {
      const firstChild = scrollRef.current.firstChild;
      const cardWidth = (firstChild?.offsetWidth || 240) + 24;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -cardWidth : cardWidth,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="relative w-full px-4 sm:px-8 md:px-12 py-12 bg-gray-50">
      <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-black drop-shadow-md">
        Popular Sports
      </h2>

      <button
        aria-label="Scroll Left"
        onClick={() => scrollByCard("left")}
        className="absolute top-1/2 left-2 -translate-y-1/2 z-10 rounded-full bg-green-600 text-white p-2 shadow-lg hover:bg-green-700 transition"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        aria-label="Scroll Right"
        onClick={() => scrollByCard("right")}
        className="absolute top-1/2 right-2 -translate-y-1/2 z-10 rounded-full bg-green-600 text-white p-2 shadow-lg hover:bg-green-700 transition"
      >
        <ChevronRight size={24} />
      </button>

      <div
        ref={scrollRef}
        className="flex overflow-x-auto space-x-6 sm:space-x-8 pb-4 scrollbar-thin scrollbar-thumb-green-400 scrollbar-track-green-100 scroll-smooth"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {popularSports.map(({ id, name, img }) => {
          const venues = topVenuesBySport[id] || [];
          return (
            <div
              key={id}
              className="flex-shrink-0 snap-center bg-white border border-green-200 rounded-2xl p-5 shadow-md hover:shadow-lg transition w-64 sm:w-72"
            >
              <div
                className="cursor-pointer"
                onClick={() => navigate(`/more-options?sport=${encodeURIComponent(name)}`)}
              >
                <img
                  src={img}
                  alt={name}
                  className="w-full h-40 object-cover rounded-xl mb-3"
                />
                <p className="text-green-900 font-semibold text-xl text-center">
                  {name}
                </p>
              </div>
              <div className="mt-3 space-y-1">
                {venues.length === 0 && (
                  <p className="text-xs text-gray-500 text-center">No venues yet</p>
                )}
                {venues.map((v) => (
                  <button
                    key={v.id}
                    className="block w-full text-left text-sm text-gray-700 hover:text-green-700 truncate"
                    title={v.name}
                    onClick={() => navigate(`/venue/${v.id}`)}
                  >
                    {v.name}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
