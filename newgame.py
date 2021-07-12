import sys
import random
import json

try:
    # Check if data available is JSON formatted.
    game_data = json.loads(sys.stdin.read().strip())
except Exception as e:
    print(f'Unable to load game data from stdin: {str(e)}')
    sys.exit(1)


def get_random_int(min, max):
    """
    Generates a random number between {min} and {max}

    :param min: min value
    :param max: max value
    :type min: int
    :type max: int
    :return: randomly generated number
    :rtype: int
    """
    return random.randint(min, max)


def get_team(user):
    """
    Get the team associated with a user

    :param user: user to lookup the team
    :type user: string
    :return: name of the team the user belongs to
    :rtype: string
    """
    for team in game_data['teams']:
        if user in game_data['teams'][team]['users']:
            return team
    return "UNKNOWN"


results = {
    'team_scores': {},
    'user_scores': {},
    'round_scores': {
        'users': [{}, {}, {}],
        'teams': [{}, {}, {}]
    },
    'other_stats': {
        'failed_cards': {}
    }
}


for idx, cur_round in enumerate(game_data['rounds']):
    # Initialize the values. This isn't strictly necessary as
    # We are already doing that below. But this way we ensure that even
    # if a player missed a round, it will still be shown (score = 0)
    for t in game_data['teams'].keys():
        results['round_scores']['teams'][idx][t] = 0
    for u in game_data['users'].keys():
        results['round_scores']['users'][idx][u] = 0

    for card, user in cur_round.items():
        user_score = round(float(get_random_int(0, 3)) * float(game_data['users'][user]['multiplier']), 2)

        if user_score == 0:
            results['other_stats']['failed_cards'][card] = results['other_stats']['failed_cards'].get(card, 0) + 1

        results['user_scores'][user] = user_score if not results['user_scores'].get(
            user, False) else results['user_scores'][user] + user_score
        results['team_scores'][get_team(user)] = user_score if not results['team_scores'].get(
            get_team(user), False) else results['team_scores'][get_team(user)] + user_score
        results['round_scores']['users'][idx][user] = user_score if not results['round_scores']['users'][idx].get(
            user, False) else results['round_scores']['users'][idx][user] + user_score
        results['round_scores']['teams'][idx][get_team(user)] = user_score if not results['round_scores']['teams'][idx].get(
            get_team(user), False) else results['round_scores']['teams'][idx][get_team(user)] + user_score

# print(json.dumps(game_data, indent=2))
print(json.dumps(results, indent=2))
