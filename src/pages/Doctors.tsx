import { useState } from "react";
import { MapPin } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Doctors = () => {
  const [nearbyDoctors, setNearbyDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  // ================================
  // Fetch hospitals around user
  // ================================
  const fetchNearbyDoctors = async (lat, lon) => {
    if (!lat || !lon) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://overpass-api.de/api/interpreter?data=[out:json];node["amenity"="hospital"](around:5000,${lat},${lon});out;`
      );

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      setNearbyDoctors(data.elements);
    } catch (error) {
      console.error("Error fetching nearby hospitals:", error);
      alert("Could not fetch nearby hospitals. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // Auto detect user location
  // ================================
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchNearbyDoctors(latitude, longitude); // auto fetch
        },
        () => {
          alert("Location permission denied. Please allow location access.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  // ================================
  // OPEN LOCATION IN GOOGLE MAPS
  // ================================
  const openLocation = (lat, lon) => {
    const url = `https://www.google.com/maps?q=${lat},${lon}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* HEADER */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl font-bold mb-4">Find Nearby Doctors</h1>
            <p className="text-lg text-muted-foreground">
              Click the button below to see nearby hospitals and doctors.
            </p>
          </div>

          {/* LOCATION BUTTON */}
          <div className="flex justify-center mb-8">
            <Button
              onClick={getUserLocation}
              className="gradient-hero text-primary-foreground shadow-soft flex items-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              Use My Location
            </Button>
          </div>

          {/* LOADING */}
          {loading && (
            <p className="text-center text-muted-foreground mb-4">
              Fetching nearby hospitals...
            </p>
          )}

          {/* RESULTS */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 ">
            {nearbyDoctors.length > 0 ? (
              nearbyDoctors.map((doctor, index) => (
                <Card key={index} className="card-hover animate-fade-in bg-white
    border-2 border-gray-300">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg">
                      {doctor.tags?.name || "Unnamed Hospital"}
                    </h3>

                    <p className="text-sm text-muted-foreground">
                      Coordinates: {doctor.lat}, {doctor.lon}
                    </p>

                    {/* ⭐ SEE LOCATION BUTTON ⭐ */}
                    <Button
                      className="mt-2"
                      onClick={() => openLocation(doctor.lat, doctor.lon)}
                    >
                      See Location
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="card-hover animate-fade-in col-span-full">
                <CardContent className="p-6 text-center text-muted-foreground">
                  Nearby doctors and hospitals will appear here after searching.
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Doctors;
