"use client";

import React, { useMemo, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";

/* ================= DISEASE DATA ================= */
const DISEASES = [
  {
    id: "chickenpox",
    name: "Chickenpox",
    overview: "Chickenpox is a contagious viral infection caused by the varicella-zoster virus. It mainly affects children and is characterized by an itchy skin rash with blisters and fever.",
    symptoms: ["Itchy skin rash", "Fever", "Fatigue", "Loss of appetite"],
    treatment: ["Rest", "Antihistamines for itching", "Calamine lotion"],
    prevention: ["Vaccination", "Avoid close contact with infected individuals"],
  },
  {
    id: "dengue",
    name: "Dengue Fever",
    overview: "Dengue fever is a mosquito-borne viral infection that causes high fever, severe body pain, and weakness. It is common in tropical and subtropical regions.",
    symptoms: ["High fever", "Severe headache", "Joint and muscle pain", "Skin rash"],
    treatment: ["Fluids", "Paracetamol", "Hospital care if severe"],
    prevention: ["Prevent mosquito bites", "Use repellents"],
  },
  {
    id: "malaria",
    name: "Malaria",
    overview: "Malaria is a serious mosquito-borne disease caused by parasites that infect red blood cells, leading to fever, chills, and flu-like illness.",
    symptoms: ["Fever with chills", "Sweating", "Headache", "Fatigue"],
    treatment: ["Antimalarial medicines", "Medical supervision"],
    prevention: ["Mosquito nets", "Anti-mosquito measures"],
  },
  {
    id: "typhoid",
    name: "Typhoid Fever",
    overview: "Typhoid fever is a bacterial infection caused by Salmonella typhi, usually spread through contaminated food and water.",
    symptoms: ["Prolonged fever", "Weakness", "Abdominal pain", "Loss of appetite"],
    treatment: ["Antibiotics", "Hydration", "Rest"],
    prevention: ["Safe drinking water", "Good sanitation"],
  },
  {
    id: "hepatitis_a",
    name: "Hepatitis A",
    overview: "Hepatitis A is a viral liver infection that spreads through contaminated food and water and usually causes short-term illness.",
    symptoms: ["Jaundice", "Fatigue", "Nausea", "Abdominal pain"],
    treatment: ["Rest", "Supportive care"],
    prevention: ["Vaccination", "Safe food and water"],
  },
  {
    id: "hepatitis_b",
    name: "Hepatitis B",
    overview: "Hepatitis B is a serious viral infection affecting the liver and can become chronic if not treated properly.",
    symptoms: ["Fatigue", "Jaundice", "Joint pain"],
    treatment: ["Antiviral medication", "Medical monitoring"],
    prevention: ["Vaccination", "Safe blood practices"],
  },
  {
    id: "sinusitis",
    name: "Sinusitis",
    overview: "Sinusitis is an inflammation of the sinus cavities, often caused by infections, allergies, or colds.",
    symptoms: ["Facial pain", "Nasal congestion", "Headache"],
    treatment: ["Decongestants", "Steam inhalation"],
    prevention: ["Treat colds early", "Avoid allergens"],
  },
  {
    id: "tonsillitis",
    name: "Tonsillitis",
    overview: "Tonsillitis is an infection of the tonsils that causes throat pain, fever, and difficulty swallowing.",
    symptoms: ["Sore throat", "Difficulty swallowing", "Fever"],
    treatment: ["Pain relievers", "Antibiotics if bacterial"],
    prevention: ["Good hygiene", "Avoid close contact with infected people"],
  },
  {
    id: "conjunctivitis",
    name: "Conjunctivitis (Pink Eye)",
    overview: "Conjunctivitis is an inflammation of the eye lining that causes redness, itching, and discharge.",
    symptoms: ["Red eyes", "Itching", "Eye discharge"],
    treatment: ["Eye drops", "Maintain eye hygiene"],
    prevention: ["Avoid touching eyes", "Hand hygiene"],
  },
  {
    id: "food_poisoning",
    name: "Food Poisoning",
    overview: "Food poisoning occurs due to consuming contaminated food or water and leads to stomach-related symptoms.",
    symptoms: ["Nausea", "Vomiting", "Diarrhea", "Stomach cramps"],
    treatment: ["Hydration", "Rest"],
    prevention: ["Proper food handling", "Clean water"],
  },
  {
    id: "cholera",
    name: "Cholera",
    overview: "Cholera is a severe bacterial infection that causes watery diarrhea and rapid dehydration if untreated.",
    symptoms: ["Severe watery diarrhea", "Dehydration"],
    treatment: ["Oral rehydration", "IV fluids in severe cases"],
    prevention: ["Clean water", "Proper sanitation"],
  },
  {
    id: "flu",
    name: "Influenza (Flu)",
    overview: "Influenza is a viral respiratory infection that causes fever, body aches, cough, and weakness.",
    symptoms: ["Fever", "Body pain", "Cough", "Fatigue"],
    treatment: ["Rest", "Fluids", "Antiviral medicines"],
    prevention: ["Flu vaccination", "Hand hygiene"],
  },
  {
    id: "covid19",
    name: "COVID-19",
    overview: "COVID-19 is a contagious respiratory disease caused by the coronavirus, affecting breathing and overall health.",
    symptoms: ["Fever", "Dry cough", "Loss of taste or smell", "Breathing difficulty"],
    treatment: ["Isolation", "Supportive care", "Doctor consultation"],
    prevention: ["Vaccination", "Mask usage", "Hand hygiene"],
  },
  {
    id: "bronchitis",
    name: "Bronchitis",
    overview: "Bronchitis is the inflammation of the bronchial tubes, leading to coughing and chest discomfort.",
    symptoms: ["Persistent cough", "Chest discomfort", "Fatigue"],
    treatment: ["Cough medicines", "Rest", "Hydration"],
    prevention: ["Avoid smoking", "Prevent respiratory infections"],
  },
  {
    id: "pneumonia",
    name: "Pneumonia",
    overview: "Pneumonia is a lung infection that can be caused by bacteria, viruses, or fungi and may be life-threatening if severe.",
    symptoms: ["Chest pain", "Fever", "Cough with phlegm", "Breathing difficulty"],
    treatment: ["Antibiotics", "Hospital care if severe"],
    prevention: ["Vaccination", "Good hygiene"],
  },
  {
    id: "tuberculosis",
    name: "Tuberculosis (TB)",
    overview: "Tuberculosis is a serious infectious disease that mainly affects the lungs and requires long-term treatment.",
    symptoms: ["Chronic cough", "Weight loss", "Night sweats", "Fever"],
    treatment: ["Long-term antibiotics", "Medical supervision"],
    prevention: ["BCG vaccine", "Early diagnosis"],
  },
  {
    id: "fever",
    name: "Fever",
    overview: "Fever is a temporary increase in body temperature, usually caused by infections or illness.",
    symptoms: ["High body temperature", "Chills", "Sweating", "Weakness"],
    treatment: ["Drink plenty of fluids", "Paracetamol", "Adequate rest"],
    prevention: ["Maintain hygiene", "Avoid infected contact"],
  },
  {
    id: "diabetes",
    name: "Diabetes",
    overview: "Diabetes is a chronic condition where the body is unable to regulate blood sugar levels properly.",
    symptoms: ["Frequent urination", "Excessive thirst", "Fatigue", "Blurred vision"],
    treatment: ["Blood sugar monitoring", "Diet control", "Medication or insulin"],
    prevention: ["Healthy diet", "Regular exercise"],
  },
  {
    id: "asthma",
    name: "Asthma",
    overview: "Asthma is a chronic respiratory condition that causes difficulty in breathing due to narrowed airways.",
    symptoms: ["Shortness of breath", "Chest tightness", "Wheezing"],
    treatment: ["Inhalers", "Avoid triggers", "Doctor consultation"],
    prevention: ["Avoid allergens", "Regular medication"],
  },
  {
    id: "hypertension",
    name: "High Blood Pressure",
    overview: "High blood pressure is a condition in which the force of blood against artery walls is consistently too high.",
    symptoms: ["Headache", "Dizziness", "Often asymptomatic"],
    treatment: ["Low salt diet", "Regular exercise", "Medication"],
    prevention: ["Stress management", "Healthy lifestyle"],
  },
{
  id: "anemia",
  name: "Anemia",
  overview: "Anemia is a condition in which the body lacks enough healthy red blood cells to carry adequate oxygen to tissues, leading to fatigue and weakness.",
  symptoms: ["Fatigue", "Weakness", "Pale skin", "Shortness of breath"],
  treatment: ["Iron supplements", "Diet improvement"],
  prevention: ["Iron-rich diet", "Regular checkups"],
},
{
  id: "thyroid_disorder",
  name: "Thyroid Disorder",
  overview: "Thyroid disorders occur when the thyroid gland produces too much or too little hormone, affecting metabolism and energy levels.",
  symptoms: ["Weight changes", "Fatigue", "Hair thinning"],
  treatment: ["Hormonal medication", "Regular monitoring"],
  prevention: ["Routine blood tests"],
},
{
  id: "arthritis",
  name: "Arthritis",
  overview: "Arthritis is the inflammation of one or more joints, causing pain, stiffness, and reduced mobility.",
  symptoms: ["Joint pain", "Stiffness", "Swelling"],
  treatment: ["Pain relievers", "Physiotherapy"],
  prevention: ["Exercise", "Healthy weight"],
},
{
  id: "osteoporosis",
  name: "Osteoporosis",
  overview: "Osteoporosis is a bone disease in which bones become weak and brittle, increasing the risk of fractures.",
  symptoms: ["Bone weakness", "Fractures"],
  treatment: ["Calcium supplements", "Bone-strengthening medicines"],
  prevention: ["Calcium-rich diet", "Weight-bearing exercise"],
},
{
  id: "acid_reflux",
  name: "Acid Reflux (GERD)",
  overview: "Acid reflux is a digestive disorder where stomach acid flows back into the food pipe, causing heartburn and discomfort.",
  symptoms: ["Heartburn", "Chest discomfort", "Sour taste"],
  treatment: ["Antacids", "Diet changes"],
  prevention: ["Avoid spicy food", "Small meals"],
},
{
  id: "gastritis",
  name: "Gastritis",
  overview: "Gastritis is the inflammation of the stomach lining, often caused by infection, alcohol, or long-term medication use.",
  symptoms: ["Stomach pain", "Nausea", "Bloating"],
  treatment: ["Antacids", "Avoid irritant foods"],
  prevention: ["Healthy diet", "Limit alcohol"],
},
{
  id: "ulcer",
  name: "Stomach Ulcer",
  overview: "A stomach ulcer is an open sore that develops on the lining of the stomach, causing burning pain and indigestion.",
  symptoms: ["Burning stomach pain", "Indigestion"],
  treatment: ["Acid reducers", "Antibiotics if required"],
  prevention: ["Avoid NSAIDs", "Balanced diet"],
},
{
  id: "ibs",
  name: "Irritable Bowel Syndrome (IBS)",
  overview: "IBS is a chronic digestive disorder that affects bowel habits and causes abdominal discomfort without visible damage.",
  symptoms: ["Abdominal pain", "Bloating", "Diarrhea or constipation"],
  treatment: ["Diet management", "Stress control"],
  prevention: ["Healthy lifestyle", "Avoid trigger foods"],
},
{
  id: "diarrhea",
  name: "Diarrhea",
  overview: "Diarrhea is a condition characterized by frequent loose or watery stools, often caused by infection or contaminated food.",
  symptoms: ["Loose stools", "Dehydration", "Abdominal cramps"],
  treatment: ["Oral rehydration", "Rest"],
  prevention: ["Clean water", "Proper hygiene"],
},
{
  id: "constipation",
  name: "Constipation",
  overview: "Constipation is a digestive condition where bowel movements become infrequent or difficult to pass.",
  symptoms: ["Hard stools", "Abdominal discomfort"],
  treatment: ["Fiber-rich diet", "Hydration"],
  prevention: ["Regular exercise", "Balanced diet"],
},
{
  id: "kidney_stones",
  name: "Kidney Stones",
  overview: "Kidney stones are hard mineral deposits that form in the kidneys and can cause severe pain during urination.",
  symptoms: ["Severe flank pain", "Blood in urine"],
  treatment: ["Pain management", "Medical procedures if needed"],
  prevention: ["Drink plenty of water"],
},
{
  id: "uti",
  name: "Urinary Tract Infection (UTI)",
  overview: "UTI is a bacterial infection that affects the urinary system, causing pain and frequent urination.",
  symptoms: ["Burning urination", "Frequent urination"],
  treatment: ["Antibiotics", "Hydration"],
  prevention: ["Proper hygiene", "Adequate fluids"],
},
{
  id: "eczema",
  name: "Eczema",
  overview: "Eczema is a chronic skin condition that causes itching, redness, and inflammation.",
  symptoms: ["Itchy skin", "Red patches"],
  treatment: ["Moisturizers", "Topical steroids"],
  prevention: ["Avoid irritants", "Skin hydration"],
},
{
  id: "psoriasis",
  name: "Psoriasis",
  overview: "Psoriasis is an autoimmune skin disorder that leads to thick, scaly patches on the skin.",
  symptoms: ["Scaly skin patches", "Itching"],
  treatment: ["Topical therapy", "Phototherapy"],
  prevention: ["Stress management"],
},
{
  id: "acne",
  name: "Acne",
  overview: "Acne is a common skin condition caused by blocked hair follicles, leading to pimples and inflammation.",
  symptoms: ["Pimples", "Oily skin"],
  treatment: ["Topical creams", "Proper skincare"],
  prevention: ["Clean skin", "Balanced diet"],
},
{
  id: "allergic_rhinitis",
  name: "Allergic Rhinitis",
  overview: "Allergic rhinitis is an allergic response that causes sneezing, runny nose, and itchy eyes.",
  symptoms: ["Sneezing", "Runny nose", "Itchy eyes"],
  treatment: ["Antihistamines", "Avoid allergens"],
  prevention: ["Reduce exposure to allergens"],
},
{
  id: "depression",
  name: "Depression",
  overview: "Depression is a mental health disorder that affects mood, thoughts, and daily functioning.",
  symptoms: ["Persistent sadness", "Loss of interest", "Fatigue"],
  treatment: ["Counseling", "Medication"],
  prevention: ["Mental health support"],
},
{
  id: "anxiety",
  name: "Anxiety Disorder",
  overview: "Anxiety disorder is a mental health condition marked by excessive worry and fear that interferes with daily life.",
  symptoms: ["Excessive worry", "Restlessness", "Palpitations"],
  treatment: ["Therapy", "Relaxation techniques"],
  prevention: ["Stress management"],
},
{
  id: "insomnia",
  name: "Insomnia",
  overview: "Insomnia is a sleep disorder that makes it difficult to fall asleep or stay asleep.",
  symptoms: ["Difficulty sleeping", "Daytime fatigue"],
  treatment: ["Sleep hygiene", "Relaxation therapy"],
  prevention: ["Regular sleep schedule"],
},
{
  id: "obesity",
  name: "Obesity",
  overview: "Obesity is a condition of excessive body fat that increases the risk of many health problems.",
  symptoms: ["Excess body weight", "Fatigue"],
  treatment: ["Diet control", "Exercise"],
  prevention: ["Healthy lifestyle"],
},
{
  id: "heart_attack",
  name: "Heart Attack",
  overview: "A heart attack occurs when blood flow to the heart is blocked, causing damage to heart muscle and requiring emergency care.",
  symptoms: ["Chest pain", "Shortness of breath", "Sweating"],
  treatment: ["Emergency medical care"],
  prevention: ["Healthy diet", "Exercise", "No smoking"],
},
{
  id: "stroke",
  name: "Stroke",
  overview: "A stroke happens when blood supply to the brain is interrupted, leading to brain damage and loss of function.",
  symptoms: ["Sudden weakness", "Speech difficulty", "Face drooping"],
  treatment: ["Emergency hospital care"],
  prevention: ["Blood pressure control"],
},
{
  id: "migraine",
  name: "Migraine",
  overview: "Migraine is a neurological condition that causes intense headaches, often accompanied by nausea, vomiting, and sensitivity to light or sound.",
  symptoms: ["Severe headache", "Nausea", "Sensitivity to light", "Blurred vision"],
  treatment: ["Pain relievers", "Rest in dark room", "Prescription medication"],
  prevention: ["Avoid triggers", "Regular sleep", "Stress management"],
},
{
  id: "epilepsy",
  name: "Epilepsy",
  overview: "Epilepsy is a neurological disorder characterized by recurrent seizures due to abnormal brain activity.",
  symptoms: ["Seizures", "Loss of consciousness", "Confusion"],
  treatment: ["Anti-epileptic drugs", "Medical supervision"],
  prevention: ["Regular medication", "Avoid seizure triggers"],
},
{
  id: "parkinsons",
  name: "Parkinson’s Disease",
  overview: "Parkinson’s disease is a progressive neurological disorder that affects movement and coordination.",
  symptoms: ["Tremors", "Slow movement", "Muscle stiffness"],
  treatment: ["Medications", "Physiotherapy"],
  prevention: ["Regular exercise", "Early medical care"],
},
{
  id: "alzheimers",
  name: "Alzheimer’s Disease",
  overview: "Alzheimer’s disease is a progressive brain disorder that affects memory, thinking, and behavior, mainly in older adults.",
  symptoms: ["Memory loss", "Confusion", "Difficulty speaking"],
  treatment: ["Supportive care", "Medications to slow progression"],
  prevention: ["Mental activity", "Healthy lifestyle"],
},
{
  id: "varicose_veins",
  name: "Varicose Veins",
  overview: "Varicose veins are swollen, twisted veins that usually appear in the legs due to poor blood circulation.",
  symptoms: ["Visible veins", "Leg pain", "Swelling"],
  treatment: ["Compression stockings", "Medical procedures"],
  prevention: ["Regular movement", "Avoid prolonged standing"],
},
{
  id: "hemorrhoids",
  name: "Hemorrhoids (Piles)",
  overview: "Hemorrhoids are swollen veins in the rectal area that cause pain, itching, and bleeding during bowel movements.",
  symptoms: ["Rectal bleeding", "Pain", "Itching"],
  treatment: ["High-fiber diet", "Topical creams", "Medical treatment if severe"],
  prevention: ["Avoid straining", "Fiber-rich diet"],
},
{
  id: "appendicitis",
  name: "Appendicitis",
  overview: "Appendicitis is an inflammation of the appendix that causes sudden abdominal pain and requires urgent medical attention.",
  symptoms: ["Lower right abdominal pain", "Nausea", "Fever"],
  treatment: ["Surgical removal", "Hospital care"],
  prevention: ["No known prevention"],
},
{
  id: "gout",
  name: "Gout",
  overview: "Gout is a type of arthritis caused by high uric acid levels, leading to sudden and severe joint pain.",
  symptoms: ["Joint pain", "Swelling", "Redness"],
  treatment: ["Pain relievers", "Uric acid–lowering medicines"],
  prevention: ["Limit alcohol", "Healthy diet"],
},
{
  id: "liver_cirrhosis",
  name: "Liver Cirrhosis",
  overview: "Liver cirrhosis is a chronic condition where healthy liver tissue is replaced by scar tissue, affecting liver function.",
  symptoms: ["Fatigue", "Jaundice", "Abdominal swelling"],
  treatment: ["Medication", "Lifestyle changes", "Liver transplant in severe cases"],
  prevention: ["Avoid alcohol", "Treat liver infections early"],
},
{
  id: "pancreatitis",
  name: "Pancreatitis",
  overview: "Pancreatitis is inflammation of the pancreas that can cause severe abdominal pain and digestive problems.",
  symptoms: ["Upper abdominal pain", "Nausea", "Vomiting"],
  treatment: ["Hospital care", "Pain management", "Fluids"],
  prevention: ["Avoid alcohol", "Healthy diet"],
}

];


/* ================= CARD COMPONENT ================= */
const InfoCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="rounded-2xl bg-white shadow-md overflow-hidden">
    <div className="bg-gradient-to-r from-blue-500 to-teal-400 px-5 py-3 text-white font-semibold">
      {title}
    </div>
    <div className="p-5 text-sm text-muted-foreground">
      {children}
    </div>
  </div>
);

/* ================= PAGE ================= */
export default function ChatPage() {
  const [search, setSearch] = useState("");
  const [active, setActive] = useState<any>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return DISEASES;
    return DISEASES.filter(d =>
      d.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
  <main className="min-h-screen bg-slate-50 overflow-visible">

      

      <section className="px-4 pt-20 pb-10">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
       <h1 className="text-3xl font-bold text-black">


            Disease Information Center
          </h1><br />
          <p className="text-muted-foreground mb-6">
            Explore symptoms, treatment, and prevention
          </p>

          {/* Search */}
        <div
  className="
    rounded-xl 
    p-[2px]
    mb-8
     border border-slate-300
    transition-all duration-500
    focus-within:bg-gradient-to-r 
    focus-within:from-blue-500 
    focus-within:to-teal-400
  "
>

  <input
  type="text"
  placeholder="Search"
  value={search}
  onChange={(e) => {
    setSearch(e.target.value);
    setActive(null);
  }}
  className="
  w-full 
  rounded-[10px] 
  border-2 border-gray-300
  px-5 py-4
 
  placeholder:text-[#9CA3AF]
   outline-none
    focus:border-blue-500
    focus-visible:ring-0
    focus-visible:ring-offset-0"


/>

</div>


          {/* Disease Grid */}
          {!active && (
  filtered.length > 0 ? (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in ">
      {filtered.map(d => (
        <div
          key={d.id}
          onClick={() => setActive(d)}
          className={cn(
            "cursor-pointer rounded-2xl shadow-md p-6 border border-slate-200",
            "transition-all duration-500 ease-out hover:shadow-lg hover:scale-[1.02] bg-white border-2 border-gray-300"
          )}
        >
          <h3
            className="text-xl font-semibold 
                       bg-gradient-to-r from-blue-500 to-teal-400 
                       bg-clip-text text-transparent"
          >
            {d.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-2">
            Tap to view details
          </p>
        </div>
      ))}
    </div>
  ) : (
    // 👇 NO RESULTS FOUND UI
    <div className="animate-fade-in text-center mt-10">
      <p className="text-lg font-medium text-gray-500">
        No results found
      </p>
      <p className="text-sm text-gray-400 mt-1">
          Please try a different disease name
      </p>
    </div>
  )
)}


          {/* Disease Detail Section */}
          {active && (
            <div className="space-y-6 animate-fade-in">
              <button
                onClick={() => setActive(null)}
                className="text-[#1CA7A6] text-sm"

              >
                ← Back
              </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">

               <InfoCard title="Overview">
  {active.overview || "Overview information is not available."}
</InfoCard>


                <InfoCard title="Symptoms">
                  <ul className="list-disc ml-5 space-y-1">
                    {active.symptoms.map((s: string, i: number) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </InfoCard>

                <InfoCard title="Treatment">
                  <ul className="list-disc ml-5 space-y-1">
                    {active.treatment.map((t: string, i: number) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </InfoCard>

                <InfoCard title="Prevention">
                  <ul className="list-disc ml-5 space-y-1">
                    {active.prevention.map((p: string, i: number) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </InfoCard>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
