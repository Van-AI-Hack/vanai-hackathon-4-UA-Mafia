#!/usr/bin/env python3
"""
Enhanced Sentiment Analysis for Canadian Music DNA
Vancouver AI Hackathon Round 4: The Soundtrack of Us
"""

import pandas as pd
import numpy as np
import json
from pathlib import Path
import re
from collections import Counter
import matplotlib.pyplot as plt
import seaborn as sns

def load_data():
    """Load the music survey data"""
    data_path = Path(__file__).parent.parent.parent / "vanai-hackathon-004-master" / "data" / "raw" / "music_survey_data.csv"
    return pd.read_csv(data_path)

def analyze_open_ended_responses(df):
    """Analyze open-ended responses for emotional insights"""
    print("\n💭 Analyzing open-ended responses...")
    
    # Key open-ended columns
    oe_columns = {
        'life_theme_song': 'Q18_Life_theme_song',
        'meaningful_lyrics': 'Q19_Lyric_that_stuck_with_you',
        'guilty_pleasures': 'Q16_Music_guilty_pleasure_text_OE'
    }
    
    sentiment_insights = {}
    
    for response_type, column in oe_columns.items():
        if column in df.columns:
            responses = df[column].dropna()
            responses = responses[responses != "Not sure"]
            responses = responses[responses != "."]
            
            if len(responses) > 0:
                sentiment_insights[response_type] = {
                    'total_responses': len(responses),
                    'sample_responses': responses.head(10).tolist(),
                    'word_frequency': analyze_word_frequency(responses),
                    'emotional_themes': extract_emotional_themes(responses)
                }
                
                print(f"   {response_type}: {len(responses)} responses")
    
    return sentiment_insights

def analyze_word_frequency(responses):
    """Analyze word frequency in responses"""
    # Combine all responses
    all_text = ' '.join(responses.astype(str))
    
    # Clean text
    all_text = re.sub(r'[^\w\s]', ' ', all_text.lower())
    words = all_text.split()
    
    # Remove common stop words
    stop_words = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'her', 'its', 'our', 'their'}
    
    filtered_words = [word for word in words if word not in stop_words and len(word) > 2]
    
    # Count frequency
    word_freq = Counter(filtered_words)
    
    return dict(word_freq.most_common(20))

def extract_emotional_themes(responses):
    """Extract emotional themes from responses"""
    # Define emotional keywords
    emotional_keywords = {
        'love': ['love', 'loved', 'loving', 'adore', 'adored', 'passion', 'passionate'],
        'sadness': ['sad', 'cry', 'cried', 'tears', 'heartbreak', 'lonely', 'melancholy'],
        'joy': ['happy', 'joy', 'celebration', 'dance', 'dancing', 'fun', 'excitement'],
        'nostalgia': ['remember', 'memory', 'childhood', 'past', 'nostalgic', 'throwback'],
        'empowerment': ['strong', 'power', 'empower', 'confident', 'courage', 'brave'],
        'peace': ['calm', 'peaceful', 'serene', 'relax', 'chill', 'zen', 'tranquil']
    }
    
    emotional_themes = {}
    
    for emotion, keywords in emotional_keywords.items():
        count = 0
        for response in responses:
            response_lower = str(response).lower()
            for keyword in keywords:
                if keyword in response_lower:
                    count += 1
                    break
        
        if count > 0:
            emotional_themes[emotion] = {
                'count': count,
                'percentage': (count / len(responses)) * 100
            }
    
    return emotional_themes

def analyze_music_bingo_sentiment(df):
    """Analyze sentiment patterns in music bingo activities"""
    print("\n🎯 Analyzing music bingo sentiment...")
    
    bingo_columns = [col for col in df.columns if col.startswith('Q12_Music_bingo_')]
    bingo_activities = [
        "Made a breakup playlist 💔",
        "Played DJ on a road trip 🚗", 
        "Used music to hype myself up 💪",
        "Cried to a sad song 😭",
        "Shared a song to flirt 👀",
        "Made a playlist just for ✨the vibes✨",
        "Played the same song 10+ times in a row 😅"
    ]
    
    bingo_sentiment = {}
    
    for i, col in enumerate(bingo_columns[:7]):
        if col in df.columns:
            count = df[col].notna().sum()
            percentage = (count / len(df)) * 100
            
            bingo_sentiment[bingo_activities[i]] = {
                'count': count,
                'percentage': percentage,
                'activity_type': categorize_bingo_activity(bingo_activities[i])
            }
    
    return bingo_sentiment

def categorize_bingo_activity(activity):
    """Categorize bingo activities by emotional type"""
    if 'breakup' in activity or 'cried' in activity:
        return 'emotional'
    elif 'hype' in activity or 'dance' in activity:
        return 'energetic'
    elif 'road trip' in activity or 'flirt' in activity:
        return 'social'
    elif 'vibes' in activity or 'same song' in activity:
        return 'personal'
    else:
        return 'other'

def analyze_demographic_sentiment_patterns(df):
    """Analyze sentiment patterns across demographics"""
    print("\n👥 Analyzing demographic sentiment patterns...")
    
    demographic_sentiment = {}
    
    # Age group sentiment patterns
    if 'AgeGroup_Broad' in df.columns:
        age_sentiment = {}
        for age_group in df['AgeGroup_Broad'].unique():
            if pd.notna(age_group):
                age_data = df[df['AgeGroup_Broad'] == age_group]
                
                # Analyze AI attitudes by age
                ai_attitudes = age_data['Q10_Songs_by_AI'].value_counts().to_dict()
                
                age_sentiment[age_group] = {
                    'ai_attitudes': ai_attitudes,
                    'sample_size': len(age_data)
                }
        
        demographic_sentiment['age_groups'] = age_sentiment
    
    # Province sentiment patterns
    if 'Province' in df.columns:
        province_sentiment = {}
        top_provinces = df['Province'].value_counts().head(5).index
        
        for province in top_provinces:
            province_data = df[df['Province'] == province]
            
            # Analyze music preferences by province
            music_prefs = province_data['Q9_Music_preference_these_days'].value_counts().to_dict()
            
            province_sentiment[province] = {
                'music_preferences': music_prefs,
                'sample_size': len(province_data)
            }
        
        demographic_sentiment['provinces'] = province_sentiment
    
    return demographic_sentiment

def generate_sentiment_insights(sentiment_data):
    """Generate key insights from sentiment analysis"""
    print("\n💡 Generating sentiment insights...")
    
    insights = []
    
    # Analyze emotional themes
    if 'life_theme_song' in sentiment_data:
        themes = sentiment_data['life_theme_song']['emotional_themes']
        top_emotion = max(themes.items(), key=lambda x: x[1]['count']) if themes else None
        
        if top_emotion:
            insights.append({
                'type': 'emotional_theme',
                'insight': f"The most common emotional theme in life theme songs is {top_emotion[0]} ({top_emotion[1]['percentage']:.1f}% of responses)",
                'data': top_emotion
            })
    
    # Analyze word frequency
    if 'life_theme_song' in sentiment_data:
        word_freq = sentiment_data['life_theme_song']['word_frequency']
        top_words = list(word_freq.items())[:5]
        
        insights.append({
            'type': 'word_frequency',
            'insight': f"Most common words in life theme songs: {', '.join([word for word, freq in top_words])}",
            'data': top_words
        })
    
    # Analyze music bingo patterns
    if 'bingo_sentiment' in sentiment_data:
        bingo_data = sentiment_data['bingo_sentiment']
        emotional_activities = [activity for activity, data in bingo_data.items() 
                              if data['activity_type'] == 'emotional']
        
        if emotional_activities:
            top_emotional = max(emotional_activities, 
                              key=lambda x: bingo_data[x]['percentage'])
            
            insights.append({
                'type': 'emotional_activity',
                'insight': f"The most common emotional music activity is '{top_emotional}' ({bingo_data[top_emotional]['percentage']:.1f}% of respondents)",
                'data': bingo_data[top_emotional]
            })
    
    return insights

def export_sentiment_data(sentiment_data, insights):
    """Export sentiment analysis results"""
    print("\n📁 Exporting sentiment data...")
    
    # Create output directory
    output_dir = Path(__file__).parent.parent / "data" / "processed"
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Export sentiment insights
    insights_file = output_dir / "sentiment_insights.json"
    with open(insights_file, 'w') as f:
        json.dump({
            'sentiment_data': sentiment_data,
            'key_insights': insights
        }, f, indent=2)
    
    print(f"   ✅ Sentiment data exported to: {insights_file}")

def main():
    """Main sentiment analysis pipeline"""
    print("💭 Enhanced Sentiment Analysis for Canadian Music DNA")
    print("="*60)
    
    # Load data
    df = load_data()
    
    # Analyze open-ended responses
    sentiment_data = analyze_open_ended_responses(df)
    
    # Analyze music bingo sentiment
    sentiment_data['bingo_sentiment'] = analyze_music_bingo_sentiment(df)
    
    # Analyze demographic patterns
    sentiment_data['demographic_patterns'] = analyze_demographic_sentiment_patterns(df)
    
    # Generate insights
    insights = generate_sentiment_insights(sentiment_data)
    
    # Export data
    export_sentiment_data(sentiment_data, insights)
    
    print("\n" + "="*60)
    print("✅ Enhanced sentiment analysis complete!")
    print(f"   Generated {len(insights)} key insights")
    print("   Sentiment data ready for frontend integration")
    print("="*60)

if __name__ == "__main__":
    main()
