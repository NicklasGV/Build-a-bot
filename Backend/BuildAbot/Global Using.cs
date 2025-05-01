// API
global using BuildAbot.Repositories;
global using BuildAbot.Services;
global using BuildAbot.Interfaces;
global using BuildAbot.Interfaces.IUser;
global using BuildAbot.Interfaces.IScript;
global using BuildAbot.Interfaces.IBot;
global using BuildAbot.Interfaces.IPost;
global using BuildAbot.Interfaces.IComment;
global using BuildAbot.Interfaces.IStatus;
global using BuildAbot.DTO.UserDTO;
global using BuildAbot.DTO.ScriptDTO;
global using BuildAbot.DTO.BotDTO;
global using BuildAbot.DTO.PostDTO;
global using BuildAbot.DTO.CommentDTO;
global using BuildAbot.DTO.LoginDTO;
global using BuildAbot.Database.Entities;
global using BuildAbot.Database;
global using BuildAbot.Helper;
global using BuildAbot.Authentication;

//Microsoft
global using Microsoft.EntityFrameworkCore;
global using Microsoft.AspNetCore.Mvc;
global using Microsoft.AspNetCore.Mvc.Filters;
global using Microsoft.OpenApi.Models;
global using Microsoft.Extensions.Options;
global using Microsoft.IdentityModel.Tokens;

//System
global using System.ComponentModel.DataAnnotations.Schema;
global using System.ComponentModel.DataAnnotations;
global using System.Text.Json.Serialization;
global using System.Net;
global using System.Security.Claims;
global using System.Text;
global using System.IdentityModel.Tokens.Jwt;