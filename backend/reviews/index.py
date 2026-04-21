"""Получение и добавление отзывов для Сигма Антивирус™"""
import json
import os
import pg8000.native
from urllib.parse import urlparse, unquote

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}

def get_conn():
    u = urlparse(os.environ['DATABASE_URL'])
    return pg8000.native.Connection(
        user=unquote(u.username),
        password=unquote(u.password),
        host=u.hostname,
        port=u.port or 5432,
        database=u.path.lstrip('/')
    )

def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    conn = get_conn()

    if event.get('httpMethod') == 'GET':
        rows = conn.run("SELECT id, name, text, stars, created_at FROM reviews ORDER BY created_at DESC LIMIT 50")
        reviews = [{'id': r[0], 'name': r[1], 'text': r[2], 'stars': r[3], 'created_at': r[4].isoformat()} for r in rows]
        conn.close()
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps(reviews, ensure_ascii=False)}

    if event.get('httpMethod') == 'POST':
        body = json.loads(event.get('body') or '{}')
        name = (body.get('name') or '').strip()[:50]
        text = (body.get('text') or '').strip()[:300]
        stars = int(body.get('stars') or 5)

        if not name or not text or not (1 <= stars <= 5):
            conn.close()
            return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Заполните все поля'})}

        rows = conn.run(
            "INSERT INTO reviews (name, text, stars) VALUES (:name, :text, :stars) RETURNING id",
            name=name, text=text, stars=stars
        )
        conn.close()
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'id': rows[0][0], 'ok': True})}

    return {'statusCode': 405, 'headers': CORS, 'body': ''}