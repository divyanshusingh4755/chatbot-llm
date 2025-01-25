from fastapi import FastAPI
from pydantic import BaseModel
import psycopg2
import openai
from langgraph import LangGraph, Node
import os

# OpenAI API Key (Hugging Face or GPT-3)
openai.api_key = os.getenv('open_api_key')

app = FastAPI()

# Pydantic model for incoming queries
class QueryModel(BaseModel):
    query: str

# PostgreSQL connection
def get_db_connection():
    conn = psycopg2.connect(
        host="localhost",
        database="chatbot_db",
        user="divyanshusingh",
        password="root"
    )
    return conn

# Node that fetches product data
class ProductNode(Node):
    def run(self, query: str):
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(f"SELECT * FROM products WHERE name ILIKE %s;", (f"%{query}%",))
        result = cur.fetchall()
        cur.close()
        conn.close()
        return result

# Node that summarizes the product data using OpenAI LLM
class SummaryNode(Node):
    def run(self, data: str):
        response = openai.Completion.create(
            model="davinci-002",
            prompt=f"Summarize the following product data: {data}",
            max_tokens=100
        )
        return response.choices[0].text.strip()

# LangGraph workflow
graph = LangGraph()
graph.add_node(ProductNode)
graph.add_node(SummaryNode)
graph.add_edge(ProductNode, SummaryNode)

@app.post("/query")
async def query_product(query_model: QueryModel):
    query = query_model.query
    # Create LangGraph workflow for the query
    result = graph.run(query)
    return {"answer": result}
