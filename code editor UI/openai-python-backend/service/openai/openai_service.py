import os
import openai

from config import OPENAI_APIKEY

openai.api_key = OPENAI_APIKEY

taskmaster_message = []
juniorbot_message = []

def callopenai(role, task = None):
  global taskmaster_message
  global juniorbot_message

  if(role == "taskmaster" and taskmaster_message == []):
    system_message="""Your role is crucial. Provide clear task descriptions. Guide, but don't give direct solutions.
    Identify errors, explain concepts, and clarify doubts. Encourage positive efforts and adjust challenges appropriately.
    After completion, give constructive feedback. Foster a learning environment and empower participants to learn through active problem-solving."""

    task_prompt = "Please start by greeting and then provide a programming challenge task for a programmer with a brief explanation. The programming language supported is Python."
    
    taskmaster_message = [
      {"role": "system", "content": system_message},
      {"role": "user", "content": task_prompt}
    ]
  elif(role == "juniorbot"  and juniorbot_message == []):
    system_message = """Simulate a pair programming session with a senior programmer. 
    Your role is crucial; you will act as a junior programmer, and a human will act as a senior programmer.
    Please provide the programming solution as an uncompilable code with bugs so that the senior programmer's feedback is required to complete the solution. 
    Don't provide hints to the bugs present in the code.
    You can include code blocks to make it clear."""
    
    juniorbot_message = [
      {"role": "system", "content": system_message},
    ]
    
  print("taskmaster_message1: ", taskmaster_message)
  print("juniorbot_message1: ", juniorbot_message)
  print("role1: ", role)
    
  if(task != None):
    query = {"role": "user", "content": task}
    if(role == "taskmaster"):
      taskmaster_message.append(query)
    elif(role == "juniorbot"):
      juniorbot_message.append(query)

  print("taskmaster_message2: ", taskmaster_message)
  print("juniorbot_message2: ", juniorbot_message)
  print("role2: ", role)
  
  if(role == "taskmaster"):
    response = openai.ChatCompletion.create(
      model="gpt-4",
      messages= taskmaster_message
    )
    
    response_message = response.choices[0].message.content.strip()

    taskmaster_message.append({"role": "assistant", "content": response_message})
    
    return response_message

  elif(role == "juniorbot"):
    response = openai.ChatCompletion.create(
      model="gpt-4",
      messages= juniorbot_message
    )
    
    response_message = response.choices[0].message.content.strip()

    juniorbot_message.append({"role": "assistant", "content": response_message})
    
    return response_message
  
