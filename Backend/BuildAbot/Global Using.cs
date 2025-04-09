// API
global using BuildAbot.Repositories;
global using BuildAbot.Services;
global using BuildAbot.Interfaces;
global using BuildAbot.Interfaces.IUser;
global using BuildAbot.Interfaces.IScript;
global using BuildAbot.DTO.UserDTO;
global using BuildAbot.DTO.ScriptDTO;
global using BuildAbot.Database.Entities;
global using BuildAbot.Database;
global using BuildAbot.Helper;


//Microsoft
global using Microsoft.EntityFrameworkCore;
global using Microsoft.AspNetCore.Mvc;
global using Microsoft.AspNetCore.Mvc.Filters;
global using Microsoft.OpenApi.Models;

//System
global using System.ComponentModel.DataAnnotations.Schema;
global using System.ComponentModel.DataAnnotations;
global using System.Text.Json.Serialization;
global using System.Net;