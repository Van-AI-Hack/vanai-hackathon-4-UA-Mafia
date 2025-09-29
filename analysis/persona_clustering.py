#!/usr/bin/env python3
"""
Canadian Music DNA - Persona Clustering Analysis
Vancouver AI Hackathon Round 4: The Soundtrack of Us
"""

import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score
import json
import os
from pathlib import Path

def load_and_prepare_data():
    """Load and prepare the music survey data for clustering"""
    # Load the dataset
    data_path = Path(__file__).parent.parent.parent / "vanai-hackathon-004-master" / "data" / "raw" / "music_survey_data.csv"
    
    try:
        df = pd.read_csv(data_path)
        print(f"✅ Dataset loaded: {len(df)} responses, {len(df.columns)} columns")
        return df
    except Exception as e:
        print(f"❌ Error loading dataset: {e}")
        return None

def feature_engineering(df):
    """Engineer features for clustering"""
    print("\n🔧 Feature Engineering...")
    
    # Select key features for clustering
    features = {
        'music_relationship': 'Q1_Relationship_with_music',
        'discovery_method': 'Q2_Discovering_music',
        'age_group': 'AgeGroup_Broad',
        'province': 'Province',
        'gender': 'Gender',
        'ai_attitude': 'Q10_Songs_by_AI',
        'ai_voice_attitude': 'Q11_Use_of_dead_artists_voice_feelings',
        'music_preference': 'Q9_Music_preference_these_days'
    }
    
    # Create feature dataframe
    feature_df = df[list(features.values())].copy()
    
    # Handle missing values
    feature_df = feature_df.fillna('Unknown')
    
    # One-hot encode categorical variables
    categorical_cols = feature_df.select_dtypes(include=['object']).columns
    feature_encoded = pd.get_dummies(feature_df, columns=categorical_cols)
    
    print(f"   Features created: {feature_encoded.shape[1]} dimensions")
    return feature_encoded, features

def find_optimal_clusters(X, max_k=8):
    """Find optimal number of clusters using silhouette score"""
    print("\n🔍 Finding optimal number of clusters...")
    
    silhouette_scores = []
    k_range = range(2, max_k + 1)
    
    for k in k_range:
        kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
        cluster_labels = kmeans.fit_predict(X)
        silhouette_avg = silhouette_score(X, cluster_labels)
        silhouette_scores.append(silhouette_avg)
        print(f"   k={k}: Silhouette Score = {silhouette_avg:.3f}")
    
    optimal_k = k_range[np.argmax(silhouette_scores)]
    print(f"✅ Optimal k = {optimal_k}")
    return optimal_k

def create_personas(df, feature_encoded, k=5):
    """Create music personas using K-means clustering"""
    print(f"\n🎭 Creating {k} music personas...")
    
    # Standardize features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(feature_encoded)
    
    # Perform clustering
    kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
    cluster_labels = kmeans.fit_predict(X_scaled)
    
    # Add cluster labels to original dataframe
    df_clustered = df.copy()
    df_clustered['persona_cluster'] = cluster_labels
    
    # Calculate silhouette score
    silhouette_avg = silhouette_score(X_scaled, cluster_labels)
    print(f"   Silhouette Score: {silhouette_avg:.3f}")
    
    return df_clustered, kmeans, scaler

def analyze_personas(df_clustered):
    """Analyze characteristics of each persona"""
    print("\n📊 Analyzing persona characteristics...")
    
    personas = {}
    
    for cluster_id in sorted(df_clustered['persona_cluster'].unique()):
        cluster_data = df_clustered[df_clustered['persona_cluster'] == cluster_id]
        
        persona = {
            'id': cluster_id,
            'size': len(cluster_data),
            'percentage': (len(cluster_data) / len(df_clustered)) * 100,
            'characteristics': {}
        }
        
        # Analyze key characteristics
        key_questions = {
            'music_relationship': 'Q1_Relationship_with_music',
            'discovery_method': 'Q2_Discovering_music',
            'age_group': 'AgeGroup_Broad',
            'ai_attitude': 'Q10_Songs_by_AI',
            'music_preference': 'Q9_Music_preference_these_days'
        }
        
        for characteristic, column in key_questions.items():
            if column in cluster_data.columns:
                top_response = cluster_data[column].mode().iloc[0] if not cluster_data[column].mode().empty else 'Unknown'
                response_distribution = cluster_data[column].value_counts().head(3).to_dict()
                persona['characteristics'][characteristic] = {
                    'top_response': top_response,
                    'distribution': response_distribution
                }
        
        personas[f'persona_{cluster_id}'] = persona
        
        print(f"\n   Persona {cluster_id} ({persona['size']} people, {persona['percentage']:.1f}%):")
        print(f"     Music Relationship: {persona['characteristics']['music_relationship']['top_response']}")
        print(f"     Discovery Method: {persona['characteristics']['discovery_method']['top_response']}")
        print(f"     Age Group: {persona['characteristics']['age_group']['top_response']}")
        print(f"     AI Attitude: {persona['characteristics']['ai_attitude']['top_response']}")
    
    return personas

def generate_persona_names_and_descriptions(personas):
    """Generate names and descriptions for each persona"""
    print("\n✍️ Generating persona names and descriptions...")
    
    persona_descriptions = {
        'persona_0': {
            'name': 'The Radio Traditionalist',
            'description': 'Discovered music through radio and traditional means. Prefers human-made music and is skeptical of AI-generated content. Values authenticity and personal connection to music.',
            'traits': ['Traditional', 'Authentic', 'Skeptical of AI', 'Radio-focused'],
            'color': '#FF6B6B'
        },
        'persona_1': {
            'name': 'The Digital Explorer',
            'description': 'Embraces new music discovery methods and is open to AI-generated music. Tech-savvy and curious about emerging technologies in music.',
            'traits': ['Tech-forward', 'Curious', 'Open to AI', 'Digital-native'],
            'color': '#4ECDC4'
        },
        'persona_2': {
            'name': 'The Casual Listener',
            'description': 'Enjoys music but doesn\'t actively seek out new content. Listens for relaxation and background ambiance. Moderate views on AI music.',
            'traits': ['Relaxed', 'Background listener', 'Moderate views', 'Easy-going'],
            'color': '#45B7D1'
        },
        'persona_3': {
            'name': 'The Music Obsessive',
            'description': 'Passionate about music and actively seeks new discoveries. Uses music for emotional regulation and personal expression. Strong opinions on music quality.',
            'traits': ['Passionate', 'Emotionally connected', 'Quality-focused', 'Expressive'],
            'color': '#96CEB4'
        },
        'persona_4': {
            'name': 'The AI Skeptic',
            'description': 'Strongly prefers human-made music and is uncomfortable with AI using deceased artists\' voices. Values human creativity and authenticity.',
            'traits': ['Human-focused', 'Authenticity-driven', 'AI-resistant', 'Creative'],
            'color': '#FFEAA7'
        }
    }
    
    # Update personas with names and descriptions
    for persona_id, persona_data in personas.items():
        if persona_id in persona_descriptions:
            personas[persona_id].update(persona_descriptions[persona_id])
    
    return personas

def export_persona_data(personas, df_clustered):
    """Export persona data for frontend use"""
    print("\n📁 Exporting persona data...")
    
    # Create output directory
    output_dir = Path(__file__).parent.parent / "data" / "processed"
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Export personas JSON
    personas_file = output_dir / "personas.json"
    with open(personas_file, 'w') as f:
        json.dump(personas, f, indent=2)
    
    # Export clustered data
    clustered_file = output_dir / "clustered_data.csv"
    df_clustered.to_csv(clustered_file, index=False)
    
    print(f"   ✅ Personas exported to: {personas_file}")
    print(f"   ✅ Clustered data exported to: {clustered_file}")

def main():
    """Main clustering pipeline"""
    print("🎵 Canadian Music DNA - Persona Clustering Analysis")
    print("="*60)
    
    # Load data
    df = load_and_prepare_data()
    if df is None:
        return
    
    # Feature engineering
    feature_encoded, feature_mapping = feature_engineering(df)
    
    # Find optimal clusters
    optimal_k = find_optimal_clusters(feature_encoded)
    
    # Create personas
    df_clustered, kmeans, scaler = create_personas(df, feature_encoded, k=optimal_k)
    
    # Analyze personas
    personas = analyze_personas(df_clustered)
    
    # Generate names and descriptions
    personas = generate_persona_names_and_descriptions(personas)
    
    # Export data
    export_persona_data(personas, df_clustered)
    
    print("\n" + "="*60)
    print("✅ Persona clustering complete!")
    print(f"   Created {len(personas)} distinct music personas")
    print("   Data ready for frontend integration")
    print("="*60)

if __name__ == "__main__":
    main()