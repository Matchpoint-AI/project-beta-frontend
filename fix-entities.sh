#!/bin/bash

# Fix unescaped entities in JSX files

# Fix apostrophes in ContentPreviewPanelDemo.tsx
sed -i "s/We'll keep all your current campaigns active/We\&apos;ll keep all your current campaigns active/g" src/components/campaign/ContentPreviewPanelDemo.tsx

# Fix apostrophes in ModifyPrompt.tsx
sed -i "s/We'll generate content based on your prompt./We\&apos;ll generate content based on your prompt./g" src/components/campaign/ModifyPrompt.tsx
sed -i "s/We'll generate content based on your prompt./We\&apos;ll generate content based on your prompt./g" src/components/campaign/ModifyPrompt.tsx

# Fix apostrophes in SocialMediaPost.tsx  
sed -i "s/We'll generate content based on your prompt./We\&apos;ll generate content based on your prompt./g" src/components/campaign/SocialMediaPost.tsx

# Fix quotes in ServiceForm.tsx
sed -i 's/"Add Services"/"Add Services"/g' src/components/onboard/ServiceForm.tsx
sed -i 's/"Add Services"/\&quot;Add Services\&quot;/g' src/components/onboard/ServiceForm.tsx

echo "Fixed unescaped entities"