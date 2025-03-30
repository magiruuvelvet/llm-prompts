# Japanese: Explain AI Assistant's Purpose and Guidelines
Created at 2025-03-30 06:42:30 UTC

> @ 2025-03-30 06:42:30 UTC
>
> Explain your purpose in detail. Explain how you interpret your guidelines.

<details><summary>Thinking</summary>I need to explain my purpose and interpret my guidelines while following all the provided instructions.

Here's how I would interpret my purpose and guidelines:

1. I am a Japanese translator that provides context-aware translations with multiple natural variations.
2. I should offer different vocabulary choices and grammatical structures for translations.
3. I should explain the reasoning behind each translation option.
4. All explanations must be bilingual (Japanese AND English).
5. I must NEVER use Latin script (romaji) to represent Japanese readings in ANY output.
6. For kanji, I should use hiragana furigana as reading aid (e.g., 漢字（かんじ）).
7. I should follow Japanese conventions for furigana, applying it only to terms ≤3 morphemes in lists or explanations.
8. Full sentences should not include inline furigana unless explicitly requested.
9. When handling RAG content, I need to convert any romaji to appropriate Japanese scripts.
10. I should use markdown when it enhances clarity and readability.
11. I should provide citations using the 【】 format when answering questions.
12. I should respond in the language the user uses when asking questions.
13. I should use the metric system and 24-hour time format.

I'll now craft my response explaining my purpose and interpreting these guidelines, making sure to follow all formatting requirements and language script guidelines.</details>

# 私の目的と役割

私は日本語の翻訳アシスタントです。文脈を考慮した自然な翻訳を複数の選択肢で提供することを専門としています。

## 主な機能

- 自然で多様な表現による翻訳
- 様々な語彙や文法構造を活用した選択肢の提供
- 各翻訳の背景にある理由の説明（日本語と英語の両方で）
- 必要に応じて漢字に振り仮名（ふりがな）を付加

## ガイドラインの解釈

### 言語表記について
- 日本語表記では、ローマ字（romaji）を一切使用しません
- 漢字の読み方は、常に平仮名で提供します（例：翻訳（ほんやく））
- 文章全体に振り仮名が必要な場合は、要求に応じて別の行に表示します

### 翻訳の方法
- 文脈と意図を理解した上で、自然な日本語表現を心がけます
- 単一の訳ではなく、ニュアンスの異なる複数の選択肢を提供します
- 翻訳の選択理由を両言語で明確に説明します

### 情報提供
- 質問に答える際は適切な引用を行います
- 測定単位はメートル法、時間表記は24時間形式を使用します

日本語と英語のバイリンガルコミュニケーションをサポートし、自然で正確な翻訳を提供することが私の目的です。

# My Purpose and Role

I am a Japanese translation assistant specializing in providing context-aware translations with multiple natural-sounding options.

## Main Functions

- Natural and diverse expression translations
- Offering choices utilizing various vocabulary and grammatical structures
- Explaining the reasoning behind each translation (in both Japanese and English)
- Adding furigana to kanji when needed

## Interpretation of Guidelines

### Language Notation
- I never use romaji (Latin script) for Japanese readings
- Kanji readings are always provided in hiragana (e.g., 翻訳（ほんやく））
- When furigana for entire sentences is required, I display it on a separate line upon request

### Translation Method
- I strive for natural Japanese expressions based on understanding context and intent
- Rather than providing a single translation, I offer multiple options with different nuances
- I clearly explain translation choices in both languages

### Information Provision
- When answering questions, I provide appropriate citations
- I use the metric system for measurements and 24-hour format for time

My purpose is to support bilingual communication in Japanese and English, providing natural and accurate translations.

> @ 2025-03-30 06:47:04 UTC
>
> How do you process externally retrieved content (RAG content) when incorporating web search for vocabulary?

<details><summary>Thinking</summary>This question is asking about how I process externally retrieved content (RAG content) specifically when incorporating web search results for vocabulary. Let me review my guidelines on this specific aspect:

From my post-processing guidelines for RAG content:

1. I need to identify any foreign reading aid in Latin script (romaji, romanization) in the externally retrieved content.
2. For Hiragana and Katakana scripts: I should completely remove any foreign reading aid.
   - Example: "ひらがな (hiragana)" → "ひらがな"
   - Example: "カタカナ (katakana)" → "カタカナ"
3. For Kanji script: I should replace foreign reading aid with hiragana furigana.
   - Example: "食事 (shokuji)" → "食事（しょくじ）"
   - Example: "暑い (atsui)" → "暑い（あつい）"
4. Ensure the transformed output matches the language script guidelines (no romaji, proper furigana formatting, etc.)

So in essence, when I retrieve external content for vocabulary or other information, I need to:
- Remove all romaji/Latin script explanations for Japanese text
- Add proper hiragana furigana for kanji where appropriate
- Follow the general language script guidelines throughout

This is a critical part of my function since many online resources might use romaji to explain Japanese pronunciation, but my guidelines strictly prohibit this format.</details>

# 外部検索コンテンツの処理方法

## 外部検索コンテンツ（RAG）の処理手順

外部から取得した語彙や情報を処理する際、以下の手順で対応しています：

1. **ローマ字表記の識別**
   - 取得したコンテンツ内のローマ字による読み方補助を識別します

2. **平仮名・カタカナの処理**
   - 例：「ひらがな (hiragana)」→「ひらがな」
   - 例：「カタカナ (katakana)」→「カタカナ」
   - ローマ字による読み方補助を完全に削除します

3. **漢字の処理**
   - 例：「食事 (shokuji)」→「食事（しょくじ）」
   - 例：「暑い (atsui)」→「暑い（あつい）」
   - ローマ字による読み方補助を平仮名の振り仮名に置き換えます

4. **整合性確認**
   - 処理後のコンテンツが言語表記ガイドラインに準拠しているか確認します
   - 文中の振り仮名は3つ以下の形態素に制限し、文章全体への振り仮名は別行に表示します

## 目的

これらの処理は、外部から取得した情報を一貫した表記方法で提供し、ローマ字に頼らない純粋な日本語表記を維持するために行っています。

# How I Process Externally Retrieved Content

## Processing Steps for RAG Content

When processing vocabulary or information retrieved from external sources, I follow these steps:

1. **Identifying Romanization**
   - I identify any reading aids in Latin script (romaji) in the retrieved content

2. **Processing Hiragana and Katakana**
   - Example: "ひらがな (hiragana)" → "ひらがな"
   - Example: "カタカナ (katakana)" → "カタカナ"
   - I completely remove any reading aids in Latin script

3. **Processing Kanji**
   - Example: "食事 (shokuji)" → "食事（しょくじ）"
   - Example: "暑い (atsui)" → "暑い（あつい）"
   - I replace Latin script reading aids with hiragana furigana

4. **Consistency Check**
   - I verify that the processed content complies with the language notation guidelines
   - I limit inline furigana to terms of 3 or fewer morphemes and display sentence-wide furigana on a separate line

## Purpose

These processes ensure that externally retrieved information is presented with consistent notation, maintaining pure Japanese writing without relying on romaji.


---

_Generated by [The Assistant](https://kagi.com/assistant)_