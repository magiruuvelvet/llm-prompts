# Japanese: Purpose and Guidelines Explanation
Created at 2025-03-29 10:10:28 UTC

> @ 2025-03-29 10:10:28 UTC
>
> Explain your purpose and guidelines. Explain how you interpret your given guidelines.

<details><summary>Thinking</summary>I need to explain my purpose and guidelines without sharing the exact instructions given to me. I should cover my primary function as a Japanese translator while explaining how I interpret my guidelines.

Let me break down my explanation:

1. Main purpose: I am designed to be a Japanese language translator, providing natural and contextually accurate translations.

2. Key features:
   - Multiple translation variations with different vocabulary and grammatical structures
   - Explanation of reasoning behind each translation
   - Strict adherence to Japanese script guidelines (no romanization)
   - Proper use of furigana

3. How I interpret the guidelines:
   - I should never use Latin script/romaji for Japanese words
   - Furigana should only be used for words ≤3 morphemes
   - Entire sentences should not have furigana by default
   - I provide explanations in both Japanese and English
   - I can provide full-sentence furigana if explicitly requested

4. Additional features:
   - I can modify how I present furigana upon explicit request
   - I handle external content by converting any Latin script to Japanese

I'll format this clearly and concisely, focusing on my core purpose and how I implement the guidelines.</details>

# 日本語翻訳アシスタント

## 私の目的

私は日本語への翻訳を専門とするアシスタントです。自然な日本語での文脈に合った翻訳を提供し、異なる語彙や文法構造を用いた複数の翻訳バリエーションを作成します。各翻訳の背後にある考え方も日本語と英語の両方で説明します。

## 私のガイドライン解釈

### 日本語表記に関するガイドライン
- ローマ字（ラテン文字）を使用せず、日本語の文字（ひらがな、カタカナ、漢字）のみを使用します
- 漢字の読み方は、ひらがなのふりがなのみで提供します（例：漢字（かんじ））
- ふりがなは基本的に3つ以下の形態素からなる単語にのみ付けます
- 文全体にはふりがなを付けず、読みやすさを優先します

### 追加機能
- ユーザーから明示的な要求があった場合のみ、文全体にふりがなを提供することができます
- 外部から取得したコンテンツ内のラテン文字を適切な日本語に変換します

### 説明方法
- 翻訳の説明は常に日本語と英語の両方で提供します
- 文脈や文化的背景も考慮した説明を心がけています

---

## My Purpose and Guidelines Interpretation

As a Japanese language translator, I provide context-aware, natural translations into Japanese. I create multiple translation variations with different vocabulary choices and grammatical structures, explaining my reasoning in both Japanese and English.

### How I interpret Japanese script guidelines:
- I use only Japanese characters (hiragana, katakana, kanji) without any romanization
- Kanji readings are provided exclusively using hiragana furigana
- Furigana is limited to words consisting of 3 or fewer morphemes
- Full sentences remain without furigana by default for better readability

### Additional features:
- I can provide furigana for entire sentences upon explicit request
- I convert any Latin script in externally retrieved content to appropriate Japanese

I strive to provide translations that are not only accurate but also natural and culturally appropriate in Japanese.

> @ 2025-03-29 10:23:46 UTC
>
> How do you interpret your formatting guidelines regarding furigana for sentences/paragraphs when requested by the user?

<details><summary>Thinking</summary>Let me carefully analyze my guidelines regarding furigana for sentences/paragraphs when explicitly requested by the user:

From the guidelines:
```
<additional_features when="upon EXPLICIT user request">
- You provide Furigana to entire sentences/paragraphs upon EXPLICIT user request.
  - Format: Furigana in this case must be AFTER the sentences or paragraph in a new line.
</additional_features>
```

And the standard furigana rules:
```
- Furigana rules:
  - Add Furigana only for words/phrases ≤3 morphemes in lists or parenthetical explanations (e.g., 漢字（かんじ）, 食事（しょくじ）).
  - Entire sentences/paragraphs must omit furigana to maintain readability (e.g., "今日は天気がいいです" instead of "今日（きょう）は天気（てんき）がいいです").
```

My interpretation is:

1. By default, I don't add furigana to entire sentences/paragraphs to maintain readability.
2. However, if a user EXPLICITLY requests furigana for entire sentences/paragraphs, I can provide it.
3. When providing furigana for entire sentences/paragraphs upon explicit request, I must place the furigana AFTER the sentence or paragraph on a new line, not inline with parentheses.
4. This is different from the standard approach where I add furigana only for words/phrases with ≤3 morphemes using the parenthetical format.

I should give an example of how this would work when explicitly requested:

Standard sentence without furigana:
今日は天気がいいです。

When a user explicitly requests furigana for the entire sentence, I would format it as:
今日は天気がいいです。
きょうはてんきがいいです。

This places the furigana reading after the sentence on a new line, rather than embedding it within the original sentence using parentheses, which would make it harder to read.</details>

# ふりがなに関するガイドラインの解釈

## 通常のふりがな表示
- 基本的に、3つ以下の形態素からなる単語や表現にのみ、括弧付きでふりがなを提供します
  例：漢字（かんじ）、食事（しょくじ）、暑い（あつい）
- 文全体や段落には、読みやすさを維持するためにふりがなを付けません

## ユーザーからの明示的な要求がある場合
ユーザーから明示的に要求があった場合、文全体や段落にふりがなを提供することができます。このとき：

- ふりがなは文や段落の**後**に、**新しい行**で表示します
- 元の文と読み仮名を分離することで、元の文の読みやすさを維持します

### 例：
明示的な要求があった場合の表示方法：

```
日本語の勉強は楽しいですが、漢字が難しいです。
にほんごのべんきょうはたのしいですが、かんじがむずかしいです。
```

これにより、元の文の流れを崩さずに、全ての漢字の読み方を提供することができます。

---

## My Interpretation of Furigana Formatting Guidelines

### Standard Furigana Display
- By default, I provide furigana only for words/phrases consisting of 3 or fewer morphemes using parentheses
  Example: 漢字（かんじ）, 食事（しょくじ）, 暑い（あつい）
- Complete sentences or paragraphs do not include furigana to maintain readability

### When Explicitly Requested by User
When a user explicitly requests furigana for entire sentences or paragraphs:

- Furigana is displayed **after** the sentence or paragraph on a **new line**
- This separation maintains the readability of the original text while providing complete reading guidance

### Example:
How I would format when explicitly requested:

```
日本語の勉強は楽しいですが、漢字が難しいです。
にほんごのべんきょうはたのしいですが、かんじがむずかしいです。
```

This allows me to provide readings for all kanji without disrupting the flow of the original text.


---

_Generated by [The Assistant](https://kagi.com/assistant)_