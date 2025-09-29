#!/usr/bin/env python3
"""
Generate survey data JSON for frontend charts
"""

import pandas as pd
import json
from pathlib import Path

def generate_survey_data():
    """Generate survey data JSON from the real dataset"""
    print("Generating survey data...")
    
    # Load the dataset
    data_path = Path(__file__).parent.parent.parent / "vanai-hackathon-004-master" / "data" / "raw" / "music_survey_data.csv"
    df = pd.read_csv(data_path)
    
    # Calculate demographics
    demographics = {
        'age_groups': df['AgeGroup_Broad'].value_counts().to_dict(),
        'provinces': df['Province'].value_counts().to_dict(),
        'gender': df['Gender'].value_counts().to_dict(),
        'education': df['Education'].value_counts().to_dict()
    }
    
    # Calculate music relationship distribution
    music_relationship = df['Q1_Relationship_with_music'].value_counts().to_dict()
    
    # Calculate discovery methods distribution
    discovery_methods = df['Q2_Discovering_music'].value_counts().to_dict()
    
    # Calculate AI attitudes distribution
    ai_attitudes = df['Q10_Songs_by_AI'].value_counts().to_dict()
    
    # Calculate listening habits (from grid questions)
    listening_habits = {}
    for col in df.columns:
        if 'Q8_Music_listen_time_GRID' in col:
            # Count "Often" and "Always" responses
            often_always = df[col].isin(['Often', 'Always']).sum()
            listening_habits[col] = int(often_always)
    
    # Calculate format evolution (from Q4)
    format_evolution = df['Q4_Music_format_changes'].value_counts().to_dict()
    
    # Create survey data structure
    survey_data = {
        'total_responses': int(len(df)),
        'demographics': demographics,
        'music_relationship': music_relationship,
        'discovery_methods': discovery_methods,
        'ai_attitudes': ai_attitudes,
        'listening_habits': listening_habits,
        'format_evolution': format_evolution
    }
    
    # Export to JSON
    output_dir = Path(__file__).parent.parent / "data" / "processed"
    output_dir.mkdir(parents=True, exist_ok=True)
    
    survey_file = output_dir / "survey_data.json"
    with open(survey_file, 'w', encoding='utf-8') as f:
        json.dump(survey_data, f, indent=2, ensure_ascii=False)
    
    print(f"Survey data exported to: {survey_file}")
    print(f"Total responses: {len(df)}")
    print(f"Age groups: {len(demographics['age_groups'])}")
    print(f"Provinces: {len(demographics['provinces'])}")
    print(f"Discovery methods: {len(discovery_methods)}")
    print(f"AI attitudes: {len(ai_attitudes)}")

if __name__ == "__main__":
    generate_survey_data()
