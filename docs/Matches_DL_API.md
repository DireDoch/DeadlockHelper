Matches 
Comprehensive match data endpoints for retrieving detailed information about games. Provides access to active matches, match metadata, replay salts, and more.

Operation possible:


get /v1/matches/active
get /v1/matches/active/raw
get /v1/matches/metadata
get /v1/matches/recently-fetched
get /v1/matches/{match_id}/live/url
get /v1/matches/{match_id}/metadata
get /v1/matches/{match_id}/metadata/raw
get /v1/matches/{match_id}/salts

1. Active 
Returns active matches that are currently being played.

Fetched from the watch tab in game, which is limited to the top 200 matches.

Rate Limits:
Type	Limit
IP	100req/s
Key	-
Global	-

Query Parameters:
account_idsCopy link to account_ids
Type:array,null integer 1...1000
Comma separated list of account ids to include


Request Example forget/v1/matches/active
Shell Curl

curl https://api.deadlock-api.com/v1/matches/active

Test Request
(get /v1/matches/active)
Status:200

[
  {
    "compat_version": null,
    "duration_s": null,
    "game_mode": null,
    "game_mode_parsed": "KECitadelGameModeInvalid",
    "game_mode_version": null,
    "lobby_id": null,
    "match_id": null,
    "match_mode": null,
    "match_mode_parsed": "Invalid",
    "match_score": null,
    "net_worth_team_0": null,
    "net_worth_team_1": null,
    "objectives_mask_team0": null,
    "objectives_mask_team1": null,
    "open_spectator_slots": null,
    "players": [
      {
        "abandoned": null,
        "account_id": null,
        "hero_id": null,
        "team": null,
        "team_parsed": "Team0"
      }
    ],
    "region_mode": null,
    "region_mode_parsed": "row",
    "spectators": null,
    "start_time": null,
    "winning_team": null,
    "winning_team_parsed": "Team0"
  }
]

2. Active as Protobuf​Copy link
Returns active matches that are currently being played, serialized as protobuf message.

Fetched from the watch tab in game, which is limited to the top 200 matches.

You have to decode the protobuf message.

Protobuf definitions can be found here: https://github.com/SteamDatabase/Protobufs

Relevant Protobuf Message:

CMsgClientToGcGetActiveMatchesResponse
Rate Limits:
Type	Limit
IP	100req/s
Key	-
Global	-
Responses

200
application/octet-stream
500Copy link to 500
Fetching active matches failed

Request Example forget/v1/matches/active/raw
Shell Curl

curl https://api.deadlock-api.com/v1/matches/active/raw

Test Request
(get /v1/matches/active/raw)
Status:200

[
  0
]

3. Bulk Metadata​Copy link
This endpoints lets you fetch multiple match metadata at once. The response is a JSON array of match metadata.

Rate Limits:
Type	Limit
IP	4req/s
Key	-
Global	10req/s
Query Parameters
include_infoCopy link to include_info
Type:boolean
default: 
"true"
Include match info in the response.

include_objectivesCopy link to include_objectives
Type:boolean
Include objectives in the response.

include_mid_bossCopy link to include_mid_boss
Type:boolean
Include midboss in the response.

include_player_infoCopy link to include_player_info
Type:boolean
Include player info in the response.

include_player_itemsCopy link to include_player_items
Type:boolean
Include player items in the response.

include_player_statsCopy link to include_player_stats
Type:boolean
Include player stats in the response.

include_player_death_detailsCopy link to include_player_death_details
Type:boolean
Include player death details in the response.

game_modeCopy link to game_mode
Type:string
enum
default: 
"normal"
nullable
Filter matches based on their game mode. Valid values: normal, street_brawl. Default: normal.

normal
street_brawl
match_idsCopy link to match_ids
Type:array,null integer
1…1000
Comma separated list of match ids, limited by limit

min_unix_timestampCopy link to min_unix_timestamp
Type:integer | null
Format:int64
Filter matches based on their start time (Unix timestamp).

max_unix_timestampCopy link to max_unix_timestamp
Type:integer | null
Format:int64
Filter matches based on their start time (Unix timestamp).

min_duration_sCopy link to min_duration_s
Type:integer | null
Format:int64
min:  
0
max:  
7000
Filter matches based on their duration in seconds (up to 7000s).

max_duration_sCopy link to max_duration_s
Type:integer | null
Format:int64
min:  
0
max:  
7000
Filter matches based on their duration in seconds (up to 7000s).

min_average_badgeCopy link to min_average_badge
Type:integer | null
Format:int32
min:  
0
max:  
116
Filter matches based on the average badge level (tier = first digits, subtier = last digit) of both teams involved. See more: https://assets.deadlock-api.com/v2/ranks

max_average_badgeCopy link to max_average_badge
Type:integer | null
Format:int32
min:  
0
max:  
116
Filter matches based on the average badge level (tier = first digits, subtier = last digit) of both teams involved. See more: https://assets.deadlock-api.com/v2/ranks

min_match_idCopy link to min_match_id
Type:integer | null
Format:int64
min:  
0
Filter matches based on their ID.

max_match_idCopy link to max_match_id
Type:integer | null
Format:int64
min:  
0
Filter matches based on their ID.

is_high_skill_range_partiesCopy link to is_high_skill_range_parties
Type:boolean | null
Filter matches based on whether they are in the high skill range.

is_low_pri_poolCopy link to is_low_pri_pool
Type:boolean | null
Filter matches based on whether they are in the low priority pool.

is_new_player_poolCopy link to is_new_player_pool
Type:boolean | null
Filter matches based on whether they are in the new player pool.

account_idsCopy link to account_ids
Type:array,null integer
Filter matches by account IDs of players that participated in the match.

hero_idsCopy link to hero_ids
Type:string | null
Filter matches based on the hero IDs. See more: https://assets.deadlock-api.com/v2/heroes

order_byCopy link to order_by
Type:string
enum
The field to order the results by.

match_id
start_time
order_directionCopy link to order_direction
Type:string
enum
The direction to order the results by.

desc
asc
limitCopy link to limit
Type:integer
Format:int32
min:  
1
max:  
10000
default: 
1000
The maximum number of matches to return.

Responses

200
application/octet-stream
400Copy link to 400
Provided parameters are invalid.

429Copy link to 429
Rate limit exceeded

Request Example forget/v1/matches/metadata
Shell Curl

curl https://api.deadlock-api.com/v1/matches/metadata

Test Request
(get /v1/matches/metadata)
Status:200

[
  0
]
4. Recently Fetched​Copy link
This endpoint returns a list of match ids that have been fetched within the last 10 minutes.

Rate Limits:
Type	Limit
IP	100req/s
Key	-
Global	-
Query Parameters
player_ingested_onlyCopy link to player_ingested_only
Type:boolean | null
If true, only return matches that have been ingested by players.

Responses

200
Recently fetched match info
application/json
500Copy link to 500
Failed to fetch recently fetched matches

Request Example forget/v1/matches/recently-fetched
Shell Curl

curl https://api.deadlock-api.com/v1/matches/recently-fetched

Test Request
(get /v1/matches/recently-fetched)
Status:200

[
  {
    "average_badge_team0": null,
    "average_badge_team1": null,
    "duration_s": 0,
    "match_id": 0,
    "match_mode": 1,
    "start_time": 0
  }
]
Recently fetched match info

5. Live Broadcast URL​Copy link
This endpoints spectates a match and returns the live URL to be used in any demofile broadcast parser.

Example Parsers:

Demofile-Net
Haste
Rate Limits:
Type	Limit
IP	10req/30mins
Key	60req/min
Global	100req/10s
Path Parameters
match_idCopy link to match_id
Type:integer
Format:int64
min:  
0
required
The match ID

Responses

200
application/json
400Copy link to 400
Provided parameters are invalid.

429Copy link to 429
Rate limit exceeded

500Copy link to 500
Spectating match failed

Request Example forget/v1/matches/{match_id}/live/url
Shell Curl

curl https://api.deadlock-api.com/v1/matches/0/live/url

Test Request
(get /v1/matches/{match_id}/live/url)
Status:200

{
  "broadcast_url": "string",
  "lobby_id": null
}

6. Metadata​
This endpoint returns the match metadata for the given match_id parsed into JSON.

Protobuf definitions can be found here: https://github.com/SteamDatabase/Protobufs

Relevant Protobuf Messages:

CMsgMatchMetaData
CMsgMatchMetaDataContents
Rate Limits:
Type	Limit
IP	From Cache: 100req/s
From S3: 100req/10s
From Steam: 10req/30mins
Key	From Cache: 100req/s
From S3: 100req/s
From Steam: 10req/min
Global	From Cache: 100req/s
From S3: 700req/s
From Steam: 10req/10s
Path Parameters
match_idCopy link to match_id
Type:integer
Format:int64
min:  
0
required
The match ID

Query Parameters
is_customCopy link to is_custom
Type:boolean | null
Responses
200Copy link to 200
Match metadata, see protobuf type: CMsgMatchMetaDataContents

400Copy link to 400
Provided parameters are invalid.

404Copy link to 404
Match metadata not found

429Copy link to 429
Rate limit exceeded

500Copy link to 500
Fetching or parsing match metadata failed

Request Example forget/v1/matches/{match_id}/metadata
Shell Curl

curl https://api.deadlock-api.com/v1/matches/0/metadata

Test Request
(get /v1/matches/{match_id}/metadata)


7. Metadata as Protobuf​Copy link
This endpoints returns the raw .meta.bz2 file for the given match_id.

You have to decompress it and decode the protobuf message.

Protobuf definitions can be found here: https://github.com/SteamDatabase/Protobufs

Relevant Protobuf Messages:

CMsgMatchMetaData
CMsgMatchMetaDataContents
Rate Limits:
Type	Limit
IP	From Cache: 100req/s
From S3: 100req/10s
From Steam: 10req/30mins
Key	From Cache: 100req/s
From S3: 100req/s
From Steam: 10req/min
Global	From Cache: 100req/s
From S3: 700req/s
From Steam: 10req/10s
Path Parameters
match_idCopy link to match_id
Type:integer
Format:int64
min:  
0
required
The match ID

Query Parameters
is_customCopy link to is_custom
Type:boolean | null
Responses

200
application/octet-stream
400Copy link to 400
Provided parameters are invalid.

404Copy link to 404
Match metadata not found

429Copy link to 429
Rate limit exceeded

500Copy link to 500
Fetching match metadata failed

Request Example forget/v1/matches/{match_id}/metadata/raw
Shell Curl

curl https://api.deadlock-api.com/v1/matches/0/metadata/raw

Test Request
(get /v1/matches/{match_id}/metadata/raw)
Status:200

[
  0
]