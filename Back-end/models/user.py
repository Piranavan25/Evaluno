# No need for ORMs with Motor, structure is flexible
# But we’ll treat this like a guide to the document fields

# MongoDB will store documents like this:
# {
#   "_id": ObjectId,
#   "user_id": "U123",
#   "username": "John",
#   "email": "john@example.com",
#   "password": "$hashed...",
#   "user_type": "enterprise",
#   "enterprise_info": {
#     "company_name": "...",
#     "company_category": "...",
#     "company_email": "..."
#   }
# }
