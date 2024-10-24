import os 
from dotenv import load_dotenv
from pathlib import Path
def load_environment():
    """_summary_

    Raises:
        FileNotFoundError: _description_
    """
    ROOT_DIR=Path(__file__).parent.parent
    print(ROOT_DIR )
    env = os.getenv('ENV', 'dev')
    env_file = f'.env.{env}'
    if os.path.exists(f"{ROOT_DIR}/{env_file}"):
        load_dotenv(env_file)
        print(f"Loaded environment: {env}")
    else:
        raise FileNotFoundError(f"{env_file} not found")
    