from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from configure_db import db
from model.expense_entity import Expense

expense_bp = Blueprint('expenses', __name__)

# GET all expenses for the current user

@expense_bp.route('/expenses', methods=['GET'])
@jwt_required()
def get_expenses():
    print("[DEBUG] Request headers:", request.headers)
    try:
        user_id = int(get_jwt_identity())
        print(f"[DEBUG] user_id from JWT: {user_id}")

        expenses = Expense.query.filter_by(user_id=user_id).all()
        print(f"[DEBUG] Retrieved {len(expenses)} expenses")

        result = []
        for e in expenses:
            print(f"[DEBUG] Processing expense ID {e.id}")
            result.append({
                'id': e.id,
                'amount': e.amount,
                'category': e.category,
                'description': e.description,
                'date': e.date.strftime('%Y-%m-%d')
            })
        return jsonify(result), 200
    except Exception as e:
        print(f"[ERROR] {str(e)}")
        return jsonify({"msg": "An error occurred", "error": str(e)}), 500



# POST new expense
@expense_bp.route('/expenses', methods=['POST'])
@jwt_required()
def add_expense():
    user_id = int(get_jwt_identity())
    data = request.get_json()

    new_expense = Expense(
        amount = data['amount'],
        category = data['category'],
        description = data.get('description', ''),
        user_id = user_id
    )
    print(new_expense)
    db.session.add(new_expense)
    db.session.commit()
    return jsonify({"msg": "Expense created!"}), 201

# PUT update expense
@expense_bp.route('/expenses/<int:expense_id>', methods=['PUT'])
@jwt_required()
def update_expense(expense_id):
    user_id = int(get_jwt_identity())
    expense = Expense.query.get_or_404(expense_id)

    if expense.user_id != user_id:
        return jsonify({"msg": "Unauthorized"}), 403

    data = request.get_json()
    expense.amount = data.get('amount', expense.amount)
    expense.category = data.get('category', expense.category)
    expense.description = data.get('description', expense.description)
    db.session.commit()

    return jsonify({"msg": "Expense updated"}), 200


# DELETE expense
@expense_bp.route('/expenses/<int:expense_id>', methods=['DELETE'])
@jwt_required()
def delete_expense(expense_id):
    user_id = int(get_jwt_identity())
    expense = Expense.query.get_or_404(expense_id)

    if expense.user_id != user_id:
        return jsonify({"msg": "Unauthorized"}), 403

    db.session.delete(expense)
    db.session.commit()
    return jsonify({"msg": "Expense deleted"}), 200

#DELETE all expenses
@expense_bp.route('/expenses', methods=['DELETE'])
@jwt_required()
def delete_all():
    user_id=int(get_jwt_identity())
    expenses = Expense.query.filter_by(user_id=user_id).all()
    if expenses:
        for e in expenses:
            db.session.delete(e)
            db.session.commit()
        return jsonify({"msg":"All expenses were deleted"})
    else:
        return jsonify({"msg":"No expenses to delete"}),200
    

#GET all by category
@expense_bp.route('/expenses/<string:category>', methods=['GET'])
@jwt_required()
def get_by_category(category):
    user_id=int(get_jwt_identity())
    expenses=Expense.query.filter_by(user_id=user_id, category=category).all()
    
    
    if not expenses:
        return jsonify({"msg":"Nothing in this category"}), 404
    
    else:

        result=[]

        for e in expenses:

            result.append({
                'id': e.id,
                'amount': e.amount,
                'category': e.category,
                'description': e.description,
                'date': e.date.strftime('%Y-%m-%d')
            })
        
        return jsonify(result), 200
    
