"""Add persisted user settings.

Revision ID: 0002_user_settings
Revises: 0001_initial
"""

from alembic import op
import sqlalchemy as sa

revision = "0002_user_settings"
down_revision = "0001_initial"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "user_settings",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("notifications", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("email_updates", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("weekly_summary", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("health_reminders", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("theme", sa.String(length=20), nullable=False, server_default="light"),
        sa.Column("data_sharing", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.UniqueConstraint("user_id"),
    )
    op.create_index("ix_user_settings_id", "user_settings", ["id"])
    op.create_index("ix_user_settings_user_id", "user_settings", ["user_id"])


def downgrade() -> None:
    op.drop_index("ix_user_settings_user_id", table_name="user_settings")
    op.drop_index("ix_user_settings_id", table_name="user_settings")
    op.drop_table("user_settings")
