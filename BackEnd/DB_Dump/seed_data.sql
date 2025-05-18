INSERT INTO public.notifications(
	id, user_name, message, notification_type, action, sent_at)
	VALUES (?, ?, ?, ?, ?, ?);