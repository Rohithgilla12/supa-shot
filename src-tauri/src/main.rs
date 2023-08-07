// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::io::Cursor;

use image::{self, DynamicImage, ImageOutputFormat};
use serde_json::json;
use uuid::Uuid;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn image_to_base64(img: &DynamicImage) -> String {
    let mut image_data: Vec<u8> = Vec::new();
    img.write_to(&mut Cursor::new(&mut image_data), ImageOutputFormat::Png)
        .unwrap();
    let res_base64 = base64::encode(image_data);
    format!("data:image/png;base64,{}", res_base64)
}

#[tauri::command]
async fn screen_capture() -> Result<String, String> {
    // Execute screencapture by using  command and add a file location to save the screenshot temporarily
    // `screencapture -ci /tmp/screenshot.png`
    let id = Uuid::new_v4();
    let path = format!("/tmp/{}.png", id);

    let output = std::process::Command::new("screencapture")
        .args(["-i", &path])
        .output()
        .expect("failed to execute process");

    // If the command is successful, then we can get the output

    // read the file

    let img = image::open(&path).unwrap();

    // convert the image to base64
    let screenshot_data = image_to_base64(&img);

    let result = json!({
        "status": output.status.success(),
        "stdout": String::from_utf8_lossy(&output.stdout),
        "stderr": String::from_utf8_lossy(&output.stderr),
        "path": screenshot_data,
    });

    Ok(result.to_string())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .invoke_handler(tauri::generate_handler![screen_capture])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
