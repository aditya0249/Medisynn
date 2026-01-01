import { Phone, MapPin, User, Heart, AlertTriangle } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";


const Emergency = () => {

  const [location, setLocation] = useState(null);
  const getAddressFromLatLon = async (lat, lon) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
    );
    const data = await res.json();
    return data.display_name; // full formatted address
  } catch (error) {
    console.log("Error fetching address:", error);
    return null;
  }
};

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const [smsNumber, setSmsNumber] = useState("");
const [showSmsModal, setShowSmsModal] = useState(false);

  

 const emergencyContacts = [
  { name: "All Emergencies", number: "112", type: "Primary" },
  { name: "Ambulance", number: "108", type: "Primary" },
  { name: "Police", number: "100", type: "Primary" },
  { name: "Fire Brigade", number: "101", type: "Primary" },
];


  const quickReference = [
    { title: "CPR Steps", description: "Check responsiveness → Call 911 → Begin chest compressions." },
    { title: "Choking", description: "Perform Heimlich maneuver if someone is choking." },
    { title: "Burns", description: "Cool the burn under running water for 10–20 mins." },
  ];
  const generateMapsLink = (lat, lon) => {
  return `https://www.google.com/maps?q=${lat},${lon}`;
};


 const handleLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        const address = await getAddressFromLatLon(lat, lon);
        const mapsUrl = generateMapsLink(lat, lon);

        setLocation({
          address: address || "Location found",
          lat,
          lon,
          mapsUrl
        });
      },
      () => alert("Unable to retrieve your location")
    );
  } else {
    alert("Geolocation is not supported by this browser");
  }
};


  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Emergency Assistance</h1>
            <p className="text-lg text-muted-foreground">
              Quick access to emergency services and life-saving instructions
            </p>
          </div>

          {/* Location */}
          <Card className="shadow-medium mb-8 animate-fade-in  bg-white
    border-2 border-gray-300">
        <CardHeader className="-mx-0.5 -mt-0.5 rounded-t-xl gradient-hero text-primary-foreground py-4 pl-4">




              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Your Current Location
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">

              <div className="space-y-2">
                {location ? (
  <div className="space-y-1">
    <p className="font-medium">{location.address}</p>
    <a 
      href={location.mapsUrl} 
      target="_blank" 
      className="text-blue-600 underline"
    >
      Open in Google Maps
    </a>
  </div>
) : (

                  <p className="text-sm text-muted-foreground -mt-1">
  Location not fetched yet.
</p>

                )}
                <Button variant="outline" className="mt-4" onClick={handleLocation}>
                  <MapPin className="w-4 h-4 mr-2" />
                  {location ? "Update Location" : "Get Current Location"}
                </Button>
                
                <Button
  className="
  w-full 
  px-5 py-3 
  rounded-full 
  bg-[#1E90FF] 
  hover:bg-[#1877E6] 
  text-white 
  font-semibold 
  shadow-md 
  transition-all
"

  onClick={() => {
    if (!location) {
      toast.error("Please fetch your location first.");
      return;
    }
    setShowSmsModal(true); // ask user whom to send
  }}
>
  Send Location
</Button>

{location && (
  <Button
    className="
      w-full 
      px-5 py-3 
      rounded-full 
      bg-red-500 
      hover:bg-red-600 
      text-white 
      font-semibold 
      shadow-md 
      transition-all
      mt-4
    "
    onClick={() => {
      setLocation(null);
      toast.success("Location stopped.");
    }}
  >
    Stop Location
  </Button>
)}


              </div>
            </CardContent>
          </Card>

          {/* Emergency Contacts */}
          <Card className="shadow-medium animate-fade-in mb-8 bg-white
    border-2 border-gray-300">
 <CardHeader className="-mx-0.5 -mt-0.5 gradient-success text-secondary-foreground mb-4 py-4 pl-3">



              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Emergency Contacts
              </CardTitle>
            </CardHeader>
          <CardContent className="p-8 pt-6 space-y-6">


              {emergencyContacts.map((contact, index) => (
                <Card key={index} className="card-hover">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 gradient-hero rounded-full flex items-center justify-center shadow-soft">
                          {contact.type === "Personal" ? (
                            <User className="w-6 h-6 text-primary-foreground" />
                          ) : contact.type === "Primary" ? (
                            <AlertTriangle className="w-6 h-6 text-primary-foreground" />
                          ) : (
                            <Heart className="w-6 h-6 text-primary-foreground" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold">{contact.name}</p>
                          <p className="text-sm text-muted-foreground">{contact.number}</p>
                        </div>
                      </div>
                      {isMobile ? (
  // MOBILE → CALL BUTTON
  <a
    href={`tel:${contact.number}`}
    className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-2"
  >
    <Phone className="w-4 h-4" />
    Call
  </a>
) : (
  // LAPTOP → COPY NUMBER BUTTON
<button
  onClick={() => {
    navigator.clipboard.writeText(contact.number);
    toast.success("Number copied to clipboard!");
  }}
  className="
    px-5 py-2 
    rounded-full 
    bg-gradient-to-r from-blue-500 to-cyan-400 
    text-white font-semibold 
    shadow-md hover:shadow-lg 
    transition-all 
    flex items-center gap-2
  "
>
  Copy Number
</button>


)}

                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>

          

          {/* Important Notice */}
          <Card className="bg-destructive/10 border-2 border-destructive/20 animate-fade-in">
            <CardContent className="p-6 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive mt-1" />
              <div>
                <h3 className="font-semibold mb-2 text-destructive">Important Notice</h3>
                <p className="text-sm text-muted-foreground">
                  If you are experiencing a life-threatening emergency, call 112 immediately. 
                  This app is designed to assist but should not replace professional emergency services.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
{showSmsModal && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-6 w-80 shadow-xl animate-fade-in">
      
      <h2 className="text-xl font-semibold text-center mb-4">Send Location</h2>

      <input
        type="tel"
        placeholder="Enter number (e.g. 9876543210)"
        value={smsNumber}
        onChange={(e) => setSmsNumber(e.target.value)}
        className="w-full border p-2 rounded-lg mb-4 focus:ring-2 focus:ring-blue-400"
      />

      <Button
         className="
    w-full 
    py-3 
    rounded-full 
    bg-gradient-to-r from-blue-500 to-cyan-400 
    text-white 
    font-semibold 
    shadow-md 
    hover:shadow-lg 
    transform-gpu 
    hover:-translate-y-0.5 
    transition-all
  "
        onClick={() => {
          if (!smsNumber.trim()) {
            toast.error("Please enter a number.");
            return;
          }

          let num = smsNumber.replace(/\D/g, "");

          if (!num.startsWith("91")) {
            num = "91" + num;
          }

          const smsText = encodeURIComponent(
  "*EMERGENCY ALERT!*\n\nMy Location:\n" +
  location.mapsUrl +
  "\n\nAddress:\n" +
  location.address +
  "\n\n*Please help immediately!*"
);




          if (isMobile) {
            window.location.href = `sms:+${num}?body=${smsText}`;
            toast.success("Opening SMS…");
          } else {
            window.open(`https://wa.me/${num}?text=${smsText}`, "_blank");
            toast.success("Opening WhatsApp…");
          }

          setShowSmsModal(false);
        }}
      >
        Send
      </Button>

      <Button
        variant="outline"
        className="w-full mt-2 rounded-full"

        onClick={() => setShowSmsModal(false)}
      >
        Cancel
      </Button>

    </div>
  </div>
)}


      </main>

      <Footer />
    </div>
  );
};

export default Emergency;
