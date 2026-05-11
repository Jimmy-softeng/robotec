"""add session_id to cart

Revision ID: 0ff3a67de444
Revises: f46b84180d52
Create Date: 2026-01-11 21:42:45.314891

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '0ff3a67de444'
down_revision = 'f46b84180d52'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('carts', schema=None) as batch_op:
        batch_op.add_column(sa.Column('session_id', sa.String(length=255), nullable=True))
        batch_op.alter_column('user_id',
               existing_type=sa.INTEGER(),
               nullable=True)
        batch_op.create_unique_constraint('uq_cart_session_id', ['session_id'])


def downgrade():
    with op.batch_alter_table('carts', schema=None) as batch_op:
        batch_op.drop_constraint('uq_cart_session_id', type_='unique')
        batch_op.alter_column('user_id',
               existing_type=sa.INTEGER(),
               nullable=False)
        batch_op.drop_column('session_id')
