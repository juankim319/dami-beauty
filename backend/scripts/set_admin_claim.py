"""Set Firebase Auth custom claim role=admin for a user."""
import argparse
import os
import sys

import firebase_admin
from firebase_admin import auth, credentials


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--email", required=True)
    parser.add_argument("--credentials", default=os.getenv("GOOGLE_APPLICATION_CREDENTIALS"))
    args = parser.parse_args()

    if not args.credentials or not os.path.exists(args.credentials):
        print("Error: GOOGLE_APPLICATION_CREDENTIALS not set or file missing", file=sys.stderr)
        sys.exit(1)

    cred = credentials.Certificate(args.credentials)
    firebase_admin.initialize_app(cred)

    user = auth.get_user_by_email(args.email)
    auth.set_custom_user_claims(user.uid, {"role": "admin"})
    print(f"Admin claim set for {args.email} (uid: {user.uid})")


if __name__ == "__main__":
    main()
