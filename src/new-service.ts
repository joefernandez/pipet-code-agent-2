/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import * as vscode from 'vscode';
// import { geminiAPIRequest } from './models/gemini-api';
// import { gemmaServiceRequest } from './models/gemma-service';
import { gemmaServiceRequest } from './models/gemma-ollama';

// Provide instructions for the AI model
const PROMPT_INSTRUCTIONS = `
Build a Python web API service using FastAPI and uvicorn.
- Just output the code, DO NOT include any explanations.
- Do not include an 'if __name__ == "__main__":' statement.
- Do not include a '@app.get("/")' statement
- Do not include a '@app.get("/info")' statement
`;

const BOILERPLATE_CODE = `
# the following code for testing and diagnosis:
@app.get("/")
async def root():
    return "Server: OK"

@app.get("/info")
async def info():
    return "Service using FastAPI version: " + fastapi.__version__

# Run the service
if __name__ == "__main__":
    # host setting makes service available to other devices
    uvicorn.run(app, host="0.0.0.0", port=8000)
`;

export async function newService() {
  vscode.window.showInformationMessage('Building new service from template...');

  // Text selection
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    console.debug('Error: no open text editor.');
    return;
  }

  // Prepare the prompt content
  const selection = editor.selection;
  const selectedCode = editor.document.getText(selection);

  // Build the full prompt using the template.
  const promptText = `${selectedCode}${PROMPT_INSTRUCTIONS}`;

  // Send the Gemma request and insert the response
  try {
    // const response: any = await geminiAPIRequest(promptText); // alternative
    const response: any = await gemmaServiceRequest(promptText);
    const responseText = response.toString();
    console.log(responseText);

    // Insert answer after selection.
    editor.edit((editBuilder) => {
      editBuilder.insert(selection.end, "\n\n" + responseText);
      editBuilder.insert(selection.end, "\n" + BOILERPLATE_CODE);
    });
  } catch (error) {
    console.error('Error:', error);
  }
}
