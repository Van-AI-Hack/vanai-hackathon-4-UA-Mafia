#!/usr/bin/env python3
"""
Canadian Music DNA - Simple Persona Creation
Vancouver AI Hackathon Round 4: The Soundtrack of Us
"""

import pandas as pd
import json
import os
from pathlib import Path

def main():
    print("🎵 Creating Canadian Music DNA Personas...")
    
    # Load data
    data_path = Path("..") / "vanai-hackathon-004-master" / "data" / "raw" / "music_survey_data.csv"
    df = pd.read_csv(data_path)
    print(f"Dataset loaded: {len(df)} responses")
    
    # Create personas based on key characteristics
    personas = {
        "persona_0": {
            "name": "The Radio Traditionalist",
            "description": "Discovered music through radio. Prefers human-made music and values authenticity.",
            "color": "#FF6B6B",
            "traits": ["Traditional", "Authentic", "Radio-focused", "Human-made music lover"],
            "size": len(df[df["Q2_Discovering_music"] == "The radio 📻"]),
            "percentage": round((len(df[df["Q2_Discovering_music"] == "The radio 📻"]) / len(df)) * 100, 1),
            "characteristics": {
                "primary_discovery": "The radio 📻",
                "ai_attitude": "Prefers human-made music",
                "music_relationship": "Traditional listener"
            }
        },
        "persona_1": {
            "name": "The Digital Explorer", 
            "description": "Embraces digital music discovery methods and is open to new technologies.",
            "color": "#4ECDC4",
            "traits": ["Tech-forward", "Digital-native", "Curious", "Open to AI"],
            "size": len(df[df["Q2_Discovering_music"].isin(["Spotify or Apple Music", "TikTok or social media"])]),
            "percentage": round((len(df[df["Q2_Discovering_music"].isin(["Spotify or Apple Music", "TikTok or social media"])]) / len(df)) * 100, 1),
            "characteristics": {
                "primary_discovery": "Digital platforms",
                "ai_attitude": "Open to AI-generated music",
                "music_relationship": "Tech-savvy explorer"
            }
        },
        "persona_2": {
            "name": "The AI Skeptic",
            "description": "Strongly prefers human-made music and is uncomfortable with AI using deceased artists' voices.",
            "color": "#45B7D1", 
            "traits": ["Human-focused", "AI-resistant", "Authenticity-driven", "Creative"],
            "size": len(df[df["Q10_Songs_by_AI"] == "Nah — I prefer music made by real people"]),
            "percentage": round((len(df[df["Q10_Songs_by_AI"] == "Nah — I prefer music made by real people"]) / len(df)) * 100, 1),
            "characteristics": {
                "primary_discovery": "Mixed methods",
                "ai_attitude": "Prefers human-made music",
                "music_relationship": "Quality-focused listener"
            }
        },
        "persona_3": {
            "name": "The Music Obsessive",
            "description": "Passionate about music and actively seeks new discoveries. Uses music for emotional regulation.",
            "color": "#96CEB4",
            "traits": ["Passionate", "Emotionally connected", "Quality-focused", "Expressive"],
            "size": len(df[df["Q1_Relationship_with_music"] == "I'm obsessed 🎵"]),
            "percentage": round((len(df[df["Q1_Relationship_with_music"] == "I'm obsessed 🎵"]) / len(df)) * 100, 1),
            "characteristics": {
                "primary_discovery": "Multiple methods",
                "ai_attitude": "Mixed views on AI",
                "music_relationship": "Music obsessive"
            }
        },
        "persona_4": {
            "name": "The Casual Listener",
            "description": "Enjoys music but doesn't actively seek out new content. Listens for relaxation and background ambiance.",
            "color": "#FFEAA7",
            "traits": ["Relaxed", "Background listener", "Moderate views", "Easy-going"],
            "size": len(df[df["Q1_Relationship_with_music"] == "I'm more of a casual listener"]),
            "percentage": round((len(df[df["Q1_Relationship_with_music"] == "I'm more of a casual listener"]) / len(df)) * 100, 1),
            "characteristics": {
                "primary_discovery": "Traditional methods",
                "ai_attitude": "Moderate views",
                "music_relationship": "Casual listener"
            }
        }
    }
    
    # Create additional insights
    insights = {
        "total_responses": len(df),
        "key_findings": [
            f"Radio is the primary discovery method for {personas['persona_0']['percentage']}% of respondents",
            f"Only {personas['persona_1']['percentage']}% primarily discover music through digital platforms",
            f"{personas['persona_2']['percentage']}% prefer human-made music over AI-generated",
            f"{personas['persona_3']['percentage']}% are obsessed with music",
            f"{personas['persona_4']['percentage']}% are casual listeners"
        ],
        "demographic_insights": {
            "age_distribution": df["AgeGroup_Broad"].value_counts().to_dict(),
            "province_distribution": df["Province"].value_counts().head(5).to_dict(),
            "gender_distribution": df["Gender"].value_counts().to_dict()
        }
    }
    
    # Export personas
    os.makedirs("data/processed", exist_ok=True)
    with open("data/processed/personas.json", "w") as f:
        json.dump(personas, f, indent=2)
    
    # Export insights
    with open("data/processed/insights.json", "w") as f:
        json.dump(insights, f, indent=2)
    
    print("\n✅ Personas created and exported!")
    print("\n📊 Persona Breakdown:")
    for persona_id, data in personas.items():
        print(f"   {data['name']}: {data['percentage']}% ({data['size']} people)")
    
    print(f"\n📁 Data exported to:")
    print(f"   - data/processed/personas.json")
    print(f"   - data/processed/insights.json")
    
    return personas, insights

if __name__ == "__main__":
    main()
