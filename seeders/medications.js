// seed the data with users
const { Medication } = require('../models');

const painRelievers = [
    {
        name: "Ibuprofen",
        directions: "Take with food to avoid stomach upset."
    },
    {
        name: "Acetaminophen",
        directions: "Do not exceed recommended dose. Avoid alcohol."
    },
    {
        name: "Naproxen",
        directions: "Take with a full glass of water. Avoid lying down for at least 10 minutes after taking."
    },
    {
        name: "Aspirin",
        directions: "Take with plenty of water. Consult a doctor if you have bleeding disorders."
    },
    {
        name: "Diclofenac",
        directions: "Take with food or milk. Do not crush or chew."
    }
];

const antihistamines = [
    {
        name: "Loratadine",
        directions: "Can be taken with or without food."
    },
    {
        name: "Cetirizine",
        directions: "Avoid alcohol while taking this medication."
    },
    {
        name: "Diphenhydramine",
        directions: "May cause drowsiness. Avoid driving or operating machinery."
    },
    {
        name: "Fexofenadine",
        directions: "Take with water. Consult a doctor if you have kidney problems."
    },
    {
        name: "Desloratadine",
        directions: "May be taken with or without food."
    }
];
const antibiotics = [
    {
        name: "Amoxicillin",
        directions: "Take with plenty of water. Finish the full course even if symptoms improve."
    },
    {
        name: "Azithromycin",
        directions: "Take on an empty stomach, at least 1 hour before or 2 hours after a meal."
    },
    {
        name: "Ciprofloxacin",
        directions: "Avoid taking with dairy products or antacids. Stay hydrated."
    },
    {
        name: "Clarithromycin",
        directions: "May be taken with or without food. Finish the full course."
    },
    {
        name: "Doxycycline",
        directions: "Take with plenty of water. Avoid exposure to direct sunlight."
    }
];

const antidepressants = [
    {
        name: "Sertraline",
        directions: "May be taken with or without food. Takes a few weeks to show full effects."
    },
    {
        name: "Fluoxetine",
        directions: "Can be taken with food. Avoid abrupt discontinuation."
    },
    {
        name: "Escitalopram",
        directions: "May be taken with or without food. Report any unusual mood changes."
    },
    {
        name: "Bupropion",
        directions: "Avoid taking close to bedtime. May cause changes in appetite."
    },
    {
        name: "Venlafaxine",
        directions: "May cause drowsiness or dizziness. Consult a doctor if side effects occur."
    }
];

const antipsychotics = [
    {
        name: "Risperidone",
        directions: "May be taken with or without food. May cause drowsiness or weight gain."
    },
    {
        name: "Olanzapine",
        directions: "Take with or without food. Regular monitoring of blood sugar and cholesterol is recommended."
    },
    {
        name: "Quetiapine",
        directions: "Can be taken with or without food. May cause dizziness."
    },
    {
        name: "Aripiprazole",
        directions: "Take with or without food. Report any unusual movements or changes in mood."
    },
    {
        name: "Clozapine",
        directions: "Regular blood tests are required due to potential side effects."
    }
];

const bronchodilators = [
    {
        name: "Albuterol",
        directions: "Use as a rescue inhaler for acute breathing difficulties."
    },
    {
        name: "Formoterol",
        directions: "Long-acting bronchodilator. Do not use for acute symptoms."
    },
    {
        name: "Salmeterol",
        directions: "Long-acting bronchodilator. Should not be used as a rescue inhaler."
    },
    {
        name: "Ipratropium",
        directions: "May be used in combination with other bronchodilators."
    },
    {
        name: "Tiotropium",
        directions: "Long-acting bronchodilator. Take at the same time each day."
    }
];

const cholesterolLoweringMeds = [
    {
        name: "Atorvastatin",
        directions: "Take in the evening. Avoid grapefruit products."
    },
    {
        name: "Simvastatin",
        directions: "Avoid taking with grapefruit juice. Report muscle pain or weakness."
    },
    {
        name: "Rosuvastatin",
        directions: "Can be taken with or without food. Monitor liver function."
    },
    {
        name: "Ezetimibe",
        directions: "May be taken with or without food. Usually combined with statins."
    },
    {
        name: "Fenofibrate",
        directions: "Take with meals. Regular monitoring of liver and kidney function."
    }
];

const diabetesMeds = [
    {
        name: "Metformin",
        directions: "May cause stomach upset. Avoid excessive alcohol intake."
    },
    {
        name: "Gliclazide",
        directions: "Monitor blood sugar levels regularly. Take with food."
    },
    {
        name: "Insulin Glargine",
        directions: "Long-acting insulin. Rotate injection sites."
    },
    {
        name: "Sitagliptin",
        directions: "May be taken with or without food. Report any unusual symptoms."
    },
    {
        name: "Empagliflozin",
        directions: "May cause increased urination. Monitor kidney function."
    }
];

const heartburnMeds = [
    {
        name: "Omeprazole",
        directions: "Take before meals. Long-term use may affect mineral absorption."
    },
    {
        name: "Ranitidine",
        directions: "May be taken with or without food. Avoid alcohol and smoking."
    },
    {
        name: "Famotidine",
        directions: "Can be taken with or without food. Report any allergic reactions."
    },
    {
        name: "Pantoprazole",
        directions: "Take 30 minutes before eating. Report any severe stomach pain."
    },
    {
        name: "Antacid (Calcium Carbonate)",
        directions: "Relieves symptoms quickly. Avoid excessive use."
    }
];

const sleepAidMeds = [
    {
        name: "Melatonin",
        directions: "Natural sleep hormone supplement. Start with a lower dose if needed."
    },
    {
        name: "Zolpidem",
        directions: "Short-term use only. Avoid alcohol while taking this medication."
    },
    {
        name: "Trazodone",
        directions: "May cause dizziness or dry mouth. Consult a doctor for dosage adjustments."
    },
    {
        name: "Valerian Root",
        directions: "Natural herbal supplement for sleep. Consult a healthcare provider if taking other medications."
    }
];

async function seedMedications() {
    await Medication.deleteMany({});

    for (let i = 0; i < painRelievers.length; i++) {
        const newMedication = new Medication({
            name: painRelievers[i].name,
            directions: painRelievers[i].directions,
            category: "Pain Reliever"
        });
        await newMedication.save();
    }

    for (let i = 0; i < antihistamines.length; i++) {
        const newMedication = new Medication({
            name: antihistamines[i].name,
            directions: antihistamines[i].directions,
            category: "Antihistamine"
        });
        await newMedication.save();
    }

    for (let i = 0; i < antibiotics.length; i++) {
        const newMedication = new Medication({
            name: antibiotics[i].name,
            directions: antibiotics[i].directions,
            category: "Antibiotic"
        });
        await newMedication.save();
    }

    for (let i = 0; i < antidepressants.length; i++) {
        const newMedication = new Medication({
            name: antidepressants[i].name,
            directions: antidepressants[i].directions,
            category: "Antidepressant"
        });
        await newMedication.save();
    }

    for (let i = 0; i < antipsychotics.length; i++) {
        const newMedication = new Medication({
            name: antipsychotics[i].name,
            directions: antipsychotics[i].directions,
            category: "Antipsychotic"
        });
        await newMedication.save();
    }

    for (let i = 0; i < bronchodilators.length; i++) {
        const newMedication = new Medication({
            name: bronchodilators[i].name,
            directions: bronchodilators[i].directions,
            category: "Bronchodilator"
        });
        await newMedication.save();
    }

    for (let i = 0; i < cholesterolLoweringMeds.length; i++) {
        const newMedication = new Medication({
            name: cholesterolLoweringMeds[i].name,
            directions: cholesterolLoweringMeds[i].directions,
            category: "Cholesterol"
        });
        await newMedication.save();
    }

    for (let i = 0; i < diabetesMeds.length; i++) {
        const newMedication = new Medication({
            name: diabetesMeds[i].name,
            directions: diabetesMeds[i].directions,
            category: "Diabetes"
        });
        await newMedication.save();
    }

    for (let i = 0; i < heartburnMeds.length; i++) {
        const newMedication = new Medication({
            name: heartburnMeds[i].name,
            directions: heartburnMeds[i].directions,
            category: "Heartburn"
        });
        await newMedication.save();
    }

    for (let i = 0; i < sleepAidMeds.length; i++) {
        const newMedication = new Medication({
            name: sleepAidMeds[i].name,
            directions: sleepAidMeds[i].directions,
            category: "Sleep Aid"
        });
        await newMedication.save();
    }
}

seedMedications();