const mockResponses = {
    itinerary: {
      sections: [
        {
          title: "Day 1: Arrival and Exploration",
          schedule: {
            "Morning": [
              "Arrival at Disneyland Resort: Check into your hotel. If you're staying at a Disneyland Resort Hotel, take advantage of early park entry.",
              "Main Street, U.S.A.: Begin your adventure with a stroll down Main Street, U.S.A. Enjoy the nostalgic atmosphere and grab a quick breakfast at the Market House or Jolly Holiday Bakery Café."
            ],
            "Mid Morning": [
              "Fantasyland: Perfect for young children and the young at heart.",
              "\"It's a small world\": A gentle boat ride with a catchy tune."
            ],
            "Evening": [
              "World of Color: End your trip with this stunning water, light, and music show at Paradise Bay."
            ]
          }
        }
      ],
      tips: [
        "Download the Disneyland App: For real-time updates, wait times, and mobile food ordering",
        "Use Genie+ and Lightning Lane: To minimize wait times for popular attractions",
        "Stay Hydrated and Take Breaks: Especially with young children, ensure everyone stays comfortable",
        "Plan Character Meet-and-Greets: Check the app for times and locations",
        "Pack Essentials: Sunscreen, hats, comfortable shoes, and a small backpack for snacks and souvenirs"
      ]
    }
  };
  
  export const mockApi = {
    async streamResponse(query, signal) {
        const response = mockResponses.itinerary;
        const encoder = new TextEncoder();
        
        const stream = new ReadableStream({
          async start(controller) {
            const sendChunk = async (text) => {
              controller.enqueue(encoder.encode(`${text}\n`));
              await new Promise(r => setTimeout(r, 100));
            };
    
            // Send content line by line
            await sendChunk("Disneyland Family-Friendly Itinerary");
            await sendChunk("");
            
            for (const section of response.sections) {
              await sendChunk(section.title);
              await sendChunk("");
              
              for (const [time, activities] of Object.entries(section.schedule)) {
                await sendChunk(`${time}:`);
                for (const activity of activities) {
                  await sendChunk(`• ${activity}`);
                }
                await sendChunk("");
              }
            }
    
            await sendChunk("Tips for a Smooth Trip");
            await sendChunk("");
            
            response.tips.forEach(async (tip, index) => {
              await sendChunk(`${index + 1}. ${tip}`);
            });
            
            await sendChunk("");
            await sendChunk("Enjoy your magical trip to Disneyland!");
            
            controller.close();
          }
        });
    
        return new Response(stream);
      },
  
    // Get chat history
    async getChatHistory() {
      return [
        {
          id: 1,
          title: "Trip to Disneyland",
          timestamp: new Date(),
        },
        // ... more history items
      ];
    },
  
    // Get credits
    async getCredits() {
      return { credits: 20 };
    }
  };