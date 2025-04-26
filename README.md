# Chrome extension for Facebook
Lets Facebook users hide posts from their feed based on string matches within
the posts.

## Possible settings
**Selector:** h3 + div + div > .x1lliihq <br>
**Filters:** Sponsored, Join, Follow, Suggested for you, Reels and short videos, posted a video to the playlist, is playing, Reels, Album, Sponsored, sponsored_ad

- *'Sponsored'* and *'sponsored_ad'* hide sponsored ads
- *'Join'*, *'Follow'* and *'Suggested for you'* hide suggestions
- *'likes'* hides business accounts liked by real people

## Sponsored
The sponsored posts are hidden by their arial attribute.
It seems that 'Learn more' label is also used in non-sponsored posts.